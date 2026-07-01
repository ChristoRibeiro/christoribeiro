#!/usr/bin/env node
// `npx christo` → a full-screen terminal calling card (Ink, no build step).
// Edit CONFIG below and you're done.
import React, { useState, useEffect } from "react";
import { render, Box, Text, useApp, useInput } from "ink";
import open from "open";
import cfonts from "cfonts";

/* ==================================================================== *
 *  EDIT ME — the whole card is built from this object.
 *  Leave a field empty ("") to hide it. Set ships: [] to drop the block.
 * ==================================================================== */
const CONFIG = {
  handle: "christo",                                  // the big ASCII wordmark
  name: "Christophe Ribeiro",
  tagline: "Entrepreneur & Software Engineer",
  location: "France",                                 // "" to hide

  // Order = order on screen. `key` is the single-press shortcut.
  links: [
    { key: "s", label: "site",     value: "christophe.ribeiro.io",  url: "https://christophe.ribeiro.io" },
    { key: "e", label: "email",    value: "christophe@ribeiro.io",  url: "mailto:christophe@ribeiro.io" },
    { key: "x", label: "x",        value: "@christoribeiro",     url: "https://x.com/christoribeiro" },
    { key: "g", label: "github",   value: "@christoribeiro",     url: "https://github.com/christoribeiro" },
    { key: "l", label: "linkedin", value: "@christoribeiro",     url: "https://linkedin.com/in/christoribeiro" },
  ],

  // Optional. Add projects to show a "recent ships" block, e.g.:
  //   { name: "my-project", desc: "what it is", url: "https://…" }
  ships: [],
};

/* ---- palette: dusk over a starry night ---------------------------- */
const C = {
  star: "#eef2fb", sky: "#8b9dc9", muted: "#56678a",
  amber: "#f6b87a", amberDim: "#c98a51", pink: "#c86b8e",
};

/* ---- big retro wordmark, rendered once with a dusk gradient -------- */
const WORDMARK = cfonts.render(CONFIG.handle, {
  font: "block",
  align: "left",
  gradient: [C.amber, C.pink],
  transitionGradient: true,
  space: false,
  lineHeight: 0,
  env: "node",
}).string.replace(/^\n+|\n+$/g, ""); // trim blank lines cfonts pads around it

/* ---- navigable list (links + ships) ------------------------------- */
const ITEMS = [
  ...CONFIG.links.map((l) => ({ ...l, kind: "link" })),
  ...(CONFIG.ships || []).map((s) => ({ ...s, kind: "ship", label: s.name })),
];

const e = React.createElement;
const T = (props, ...kids) => e(Text, props, ...kids);
const B = (props, ...kids) => e(Box, props, ...kids);
const pad = (s, n) => (s.length >= n ? s : s + " ".repeat(n - s.length));

function openItem(it, setMsg) {
  if (!it || !it.url) return;
  setMsg(`opening ${it.label || it.name}…`);
  open(it.url).catch(() => setMsg(`couldn't open ${it.url}`));
}

function Eyebrow({ children }) {
  return B({ marginTop: 1 }, T({ color: C.muted }, `· ${children} ·`));
}

function LinkRow({ item, selected }) {
  return B(
    null,
    T({ color: selected ? C.amber : C.muted }, selected ? "❯ " : "  "),
    T({ color: C.amber }, `[${item.key || "·"}] `),
    T({ color: selected ? C.star : C.sky, bold: selected }, pad(item.label, 8)),
    T({ color: C.muted }, " " + (item.value || ""))
  );
}

function ShipRow({ item, selected }) {
  return B(
    null,
    T({ color: selected ? C.amber : C.muted }, selected ? "❯ " : "  "),
    T({ color: C.amberDim }, "→ "),
    T({ color: selected ? C.star : C.sky, bold: selected }, pad(item.name, 14)),
    T({ color: C.muted }, item.desc || "")
  );
}

function App() {
  const { exit } = useApp();
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState("");
  const isTTY = Boolean(process.stdin.isTTY);

  // full-screen size, kept in sync with the terminal
  const [size, setSize] = useState({
    cols: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  });
  useEffect(() => {
    if (!isTTY) return;
    const onResize = () =>
      setSize({ cols: process.stdout.columns || 80, rows: process.stdout.rows || 24 });
    process.stdout.on("resize", onResize);
    return () => process.stdout.off("resize", onResize);
  }, [isTTY]);

  // In a pipe / non-TTY (or CI), print one frame then leave cleanly.
  useEffect(() => {
    if (!isTTY) {
      const t = setTimeout(() => exit(), 60);
      return () => clearTimeout(t);
    }
  }, [isTTY, exit]);

  useInput(
    (input, key) => {
      if (key.upArrow || input === "k") setI((p) => (p - 1 + ITEMS.length) % ITEMS.length);
      else if (key.downArrow || input === "j") setI((p) => (p + 1) % ITEMS.length);
      else if (key.return) openItem(ITEMS[i], setMsg);
      else if (input === "q" || key.escape) exit();
      else {
        const l = CONFIG.links.find((x) => x.key === input);
        if (l) openItem(l, setMsg);
      }
    },
    { isActive: isTTY }
  );

  const linkCount = CONFIG.links.length;

  return B(
    // fill the whole terminal and center everything in it
    { width: size.cols, height: size.rows, flexDirection: "column", alignItems: "center", justifyContent: "center" },

    // big wordmark
    B(null, T(null, WORDMARK)),

    // identity
    B({ marginTop: 1, flexDirection: "column", alignItems: "center" },
      T({ color: C.star, bold: true }, CONFIG.name || ""),
      CONFIG.tagline ? T({ color: C.sky }, CONFIG.tagline) : null,
      CONFIG.location ? B(null, T({ color: C.amberDim }, "◈ "), T({ color: C.muted }, CONFIG.location)) : null
    ),

    // links
    e(Eyebrow, { key: "cl" }, "connect"),
    B({ key: "links", flexDirection: "column" },
      ...CONFIG.links.map((l, idx) =>
        e(LinkRow, { key: "l" + idx, item: l, selected: i === idx })
      )
    ),

    // ships (optional)
    ...(CONFIG.ships && CONFIG.ships.length
      ? [
          e(Eyebrow, { key: "sl" }, "recent ships"),
          B({ key: "ships", flexDirection: "column" },
            ...CONFIG.ships.map((s, idx) =>
              e(ShipRow, { key: "s" + idx, item: s, selected: i === linkCount + idx })
            )
          ),
        ]
      : []),

    // footer / status
    B({ marginTop: 1 },
      msg
        ? T({ color: C.amber }, msg)
        : T({ color: C.muted },
            "↑/↓ move · ↵ open · ",
            T({ color: C.amber }, CONFIG.links.map((l) => l.key).join(" ")),
            " · ",
            T({ color: C.amber }, "q"),
            " quit"
          )
    )
  );
}

/* ---- full-screen lifecycle: alternate buffer + hidden cursor ------- */
const TTY = process.stdout.isTTY;
const enter = () => { if (TTY) process.stdout.write("\x1b[?1049h\x1b[?25l\x1b[2J\x1b[H"); };
const leave = () => { if (TTY) process.stdout.write("\x1b[?25h\x1b[?1049l"); };

enter();
const app = render(e(App));
app.waitUntilExit().then(
  () => { leave(); if (!process.stdin.isTTY) process.exit(0); },
  () => { leave(); if (!process.stdin.isTTY) process.exit(0); }
);
process.on("exit", leave);
