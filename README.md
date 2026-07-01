# christo

[![npm](https://img.shields.io/npm/v/christo?color=f6b87a&label=christo)](https://www.npmjs.com/package/christo)
[![npm](https://img.shields.io/npm/v/christoribeiro?color=c86b8e&label=christoribeiro)](https://www.npmjs.com/package/christoribeiro)
[![license](https://img.shields.io/npm/l/christo?color=8b9dc9)](./LICENSE)

A full-screen terminal calling card — runs right in your terminal, no browser.

```bash
npx christo
# or
npx christoribeiro
```

Built with [Ink](https://github.com/vadimdemedes/ink), in the spirit of
`npx ctate` / `npx milstead`. Keyboard shortcuts open your links in the browser.

## Keys

| key | action |
| --- | --- |
| `↑` `↓` | move between links |
| `↵` | open the selected link |
| `s` `e` `x` `g` `l` | jump straight to site / email / x / github / linkedin |
| `q` | quit |

## Make it yours

Everything renders from the `CONFIG` object at the top of [`cli.js`](./cli.js) —
name, tagline, location, links (each with its shortcut `key`), and optional
`ships` (projects). Leave a field `""` to hide it; set `ships: []` to drop the
projects block.

## Run locally

```bash
npm install
npx .          # or: npm start
```

## Publishing

Published under two names from the same source. With npm 2FA, each name needs a
fresh one-time code, so publish them one at a time:

```bash
npm version patch                 # bump 1.0.0 → 1.0.1
npm publish --otp=CODE1           # → christo

npm pkg set name=christoribeiro bin.christoribeiro=cli.js && npm pkg delete bin.christo
npm publish --otp=CODE2           # → christoribeiro
npm pkg set name=christo bin.christo=cli.js && npm pkg delete bin.christoribeiro
```

Without 2FA, `./publish.sh` does both in one go.

## License

MIT © [Christophe Ribeiro](https://christophe.ribeiro.io)
