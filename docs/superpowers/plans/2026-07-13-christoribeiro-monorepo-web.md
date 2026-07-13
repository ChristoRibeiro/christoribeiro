# christoribeiro Monorepo + Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir le repo en monorepo pnpm (`apps/cli` + `apps/web`) sans casser la publication npm du CLI, et ajouter un site Next.js v1 (landing/à propos + liens) déployable sur Vercel.

**Architecture:** Deux workspaces pnpm indépendants sous `apps/`. Le CLI Ink existant est déplacé tel quel dans `apps/cli` (0 ligne de `cli.js` modifiée) ; son workflow OIDC reste au même chemin. Un nouvel app Next.js (App Router, statique-first) vit dans `apps/web`, reprenant la palette « dusk » du CLI, prêt à accueillir de futures pages (CV, compétences, projets).

**Tech Stack:** pnpm workspaces · Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · npm OIDC trusted publishing (CI).

## Global Constraints

- **Gestionnaire** : pnpm. Version épinglée `packageManager: "pnpm@10.33.3"` (racine).
- **Publication npm** : le step de publish reste `npm publish` (jamais `pnpm publish`) pour préserver l'OIDC trusted publishing (npm ≥ 11.5.1). Le fichier `.github/workflows/publish.yml` **garde exactement ce chemin** (la config du trusted publisher npm y est liée).
- **Double nom npm** : `christo` + `christoribeiro`, obtenus en mutant `apps/cli/package.json` (`name` + `bin`). Logique inchangée.
- **Isolation React** : `apps/cli` = React `^18.3.1` ; `apps/web` = React `^19`. pnpm les isole, aucun conflit.
- **Palette de marque** (tokens) : `star #eef2fb`, `sky #8b9dc9`, `muted #56678a`, `amber #f6b87a`, `amber-dim #c98a51`, `pink #c86b8e`, fond `dusk #0e1220`.
- **Liens** (identiques au CLI) : site `https://christophe.ribeiro.io`, email `christophe@ribeiro.io`, x `https://x.com/christoribeiro`, github `https://github.com/christoribeiro`, linkedin `https://linkedin.com/in/christoribeiro`.
- **Commits** : messages simples, sans co-author ni mention d'IA (préférence globale de Christophe).
- **Lockfile** : `pnpm-lock.yaml` committé ; `package-lock.json` supprimé et retiré du `.gitignore`.
- **v1 = une page** `/`. CV / compétences / projets = hors périmètre.

---

### Task 1: Restructurer en workspace pnpm + déplacer le CLI dans `apps/cli`

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (racine, remplace l'actuel)
- Create: `apps/cli/LICENSE` (copie de la racine)
- Modify (git mv): `cli.js` → `apps/cli/cli.js`
- Modify (git mv): `package.json` → `apps/cli/package.json`
- Modify (git mv): `publish.sh` → `apps/cli/publish.sh`
- Modify (git mv): `README.md` → `apps/cli/README.md`
- Create: `README.md` (racine, nouveau, présentation du repo)
- Modify: `.gitignore`

**Interfaces:**
- Produces : workspace `christo` (dans `apps/cli`, script `start`) et workspace `web` (créé en Task 3) filtrables via `pnpm --filter <name>`. La racine expose les scripts `dev`, `build`, `cli`.

- [ ] **Step 1: Déplacer les fichiers du CLI (conserver l'historique git)**

```bash
cd /Users/christophe/Developer/christo
mkdir -p apps/cli
git mv cli.js apps/cli/cli.js
git mv package.json apps/cli/package.json
git mv publish.sh apps/cli/publish.sh
git mv README.md apps/cli/README.md
cp LICENSE apps/cli/LICENSE   # npm n'inclut le LICENSE que depuis le dossier du package
```

- [ ] **Step 2: Créer `pnpm-workspace.yaml`**

Fichier `pnpm-workspace.yaml` :
```yaml
packages:
  - "apps/*"
```

- [ ] **Step 3: Créer le `package.json` racine (glue workspace)**

Fichier `package.json` :
```json
{
  "name": "christoribeiro-monorepo",
  "private": true,
  "packageManager": "pnpm@10.33.3",
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "cli": "pnpm --filter christo start"
  }
}
```

- [ ] **Step 4: Créer le `README.md` racine**

Fichier `README.md` :
```markdown
# christoribeiro

Monorepo personnel de Christophe Ribeiro.

- [`apps/cli`](./apps/cli) — carte de visite terminal (`npx christo` / `npx christoribeiro`), publiée sur npm.
- [`apps/web`](./apps/web) — site personnel, déployé sur Vercel (christoribeiro.com).

## Développer

```bash
pnpm install
pnpm dev     # site Next.js (apps/web)
pnpm cli     # lance le CLI (apps/cli)
```
```

- [ ] **Step 5: Mettre à jour `.gitignore`**

Remplacer le contenu de `.gitignore` par :
```
node_modules/
*.log
.DS_Store
.next/
.vercel/
out/
```
(`package-lock.json` est retiré — on committe `pnpm-lock.yaml`.)

- [ ] **Step 6: Nettoyer l'ancien npm state et installer avec pnpm**

```bash
cd /Users/christophe/Developer/christo
rm -rf node_modules package-lock.json apps/cli/node_modules
pnpm install
```
Expected : pnpm crée `pnpm-lock.yaml` et installe les deps de `apps/cli`. Aucune erreur.

- [ ] **Step 7: Vérifier que le CLI tourne encore**

```bash
node apps/cli/cli.js | head -20
```
Expected : le wordmark ASCII + « Christophe Ribeiro » + les liens s'affichent (une frame, puis sortie en non-TTY).

- [ ] **Step 8: Vérifier le contenu du tarball npm**

```bash
cd apps/cli && npm pack --dry-run
```
Expected : la liste inclut `cli.js`, `package.json`, `README.md`, `LICENSE`. Puis `cd ..`.

- [ ] **Step 9: Commit**

```bash
cd /Users/christophe/Developer/christo
git add -A
git commit -m "Passe le repo en monorepo pnpm et déplace le CLI dans apps/cli"
```

---

### Task 2: Adapter le workflow de publication au nouveau chemin (OIDC préservé)

**Files:**
- Modify: `.github/workflows/publish.yml`

**Interfaces:**
- Consumes : `apps/cli/package.json` (version, name, bin) créé en Task 1.
- Produces : publication inchangée de `christo` + `christoribeiro` sur push `main`.

- [ ] **Step 1: Réécrire `publish.yml` pour publier depuis `apps/cli`**

Le job publie depuis `apps/cli` via `defaults.run.working-directory`. On **retire l'étape d'install** (le CLI n'a pas de build ni de script prepublish ; `npm publish` n'a besoin que des fichiers du package) → chemin OIDC minimal, sans pnpm en CI.

Contenu complet de `.github/workflows/publish.yml` :
```yaml
name: publish to npm

on:
  push:
    branches: [main]
  workflow_dispatch:

# OIDC trusted publishing — no NPM_TOKEN needed, nothing to rotate.
permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/cli
    steps:
      - uses: actions/checkout@v4

      # No registry-url: it writes a placeholder _authToken that shadows OIDC.
      - uses: actions/setup-node@v4
        with:
          node-version: 24

      # trusted publishing needs npm >= 11.5.1
      - run: npm install -g npm@latest

      - name: Publish christoribeiro + christo (new versions only)
        env:
          NODE_AUTH_TOKEN: ""   # ensure no token shadows OIDC
        run: |
          set -uo pipefail
          echo "node $(node --version) · npm $(npm --version)"
          version=$(node -p "require('./package.json').version")
          fail=0

          # publish <npm-name> <bin-to-keep> <bin-to-drop>
          publish() {
            name="$1"; keep="$2"; drop="$3"
            npm pkg set name="$name" "bin.$keep=cli.js" >/dev/null
            npm pkg delete "bin.$drop" >/dev/null 2>&1 || true
            remote=$(npm view "$name" version 2>/dev/null || true)
            if [ "$remote" = "$version" ]; then
              echo "· $name@$version already on npm — skipping"
              return
            fi
            echo "· publishing $name@$version"
            if npm publish --access public --verbose; then
              echo "  ✓ $name@$version published"
            else
              echo "  ✗ $name FAILED to publish"
              fail=1
            fi
          }

          publish christoribeiro christoribeiro christo
          publish christo        christo        christoribeiro

          exit $fail
```

- [ ] **Step 2: Vérifier la syntaxe YAML et les chemins**

```bash
cd /Users/christophe/Developer/christo
node -e "require('yaml') && console.log('has yaml')" 2>/dev/null || python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/publish.yml')); print('yaml OK')"
grep -n "working-directory: apps/cli" .github/workflows/publish.yml
```
Expected : `yaml OK` et la ligne `working-directory: apps/cli` présente. Le chemin du fichier workflow est inchangé (`.github/workflows/publish.yml`).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/publish.yml
git commit -m "Publie le CLI depuis apps/cli (chemin workflow OIDC inchangé)"
```

> Note d'exécution (opérateur) : la validation réelle de la publication se fera au prochain push sur `main`. Ne pas bumper la version tant que le site n'est pas prêt, pour éviter une publication prématurée. Le workflow skippe si la version distante == locale.

---

### Task 3: Scaffolder l'app Next.js `apps/web` (squelette + tokens de marque)

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next-env.d.ts`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/app/globals.css`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx` (placeholder, remplacé en Task 4)
- Create: `apps/web/.eslintrc.json`
- Create: `apps/web/README.md`

**Interfaces:**
- Produces : workspace `web` (script `dev`/`build`/`start`), tokens Tailwind `--color-*` consommés par la Task 4. Alias TS `@/*` → racine de `apps/web`.

- [ ] **Step 1: `apps/web/package.json`**

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.1.0"
  }
}
```

- [ ] **Step 2: `apps/web/next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 3: `apps/web/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: `apps/web/next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

- [ ] **Step 5: `apps/web/postcss.config.mjs`**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 6: `apps/web/app/globals.css` (Tailwind v4 + tokens de marque)**

```css
@import "tailwindcss";

@theme {
  --color-star: #eef2fb;
  --color-sky: #8b9dc9;
  --color-muted: #56678a;
  --color-amber: #f6b87a;
  --color-amber-dim: #c98a51;
  --color-pink: #c86b8e;
  --color-dusk: #0e1220;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}

html,
body {
  background-color: var(--color-dusk);
  color: var(--color-star);
}
```

- [ ] **Step 7: `apps/web/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Christophe Ribeiro",
  description: "Entrepreneur & Software Engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: `apps/web/app/page.tsx` (placeholder, remplacé en Task 4)**

```tsx
export default function Home() {
  return <main className="p-8 font-mono text-sky">christoribeiro.com — bientôt.</main>;
}
```

- [ ] **Step 9: `apps/web/.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 10: `apps/web/README.md`**

```markdown
# apps/web

Site personnel de Christophe Ribeiro — Next.js (App Router), déployé sur Vercel.

```bash
pnpm --filter web dev     # http://localhost:3000
pnpm --filter web build
```

Déploiement Vercel : Root Directory = `apps/web` (voir le plan, Task 5).
```

- [ ] **Step 11: Installer les deps du nouveau workspace**

```bash
cd /Users/christophe/Developer/christo
pnpm install
```
Expected : `next`, `react@19`, `tailwindcss@4` installés dans `apps/web` ; `pnpm-lock.yaml` mis à jour. Aucune erreur.

- [ ] **Step 12: Vérifier que le build passe**

```bash
pnpm --filter web build
```
Expected : `next build` réussit, la route `/` est prérendue (statique). Pas d'erreur TypeScript ni Tailwind.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Scaffolde le site Next.js (apps/web) avec Tailwind et tokens de marque"
```

---

### Task 4: Construire la landing v1 (`/`)

**Files:**
- Create: `apps/web/lib/links.ts`
- Create: `apps/web/components/Hero.tsx`
- Create: `apps/web/components/Links.tsx`
- Modify: `apps/web/app/page.tsx` (remplace le placeholder)

**Interfaces:**
- Consumes : tokens `--color-*` (Task 3), alias `@/*`.
- Produces : page `/` complète (hero + à propos + liens + clin d'œil `npx christo`).

- [ ] **Step 1: `apps/web/lib/links.ts` (source unique des liens)**

```ts
export type Link = {
  label: string;
  value: string;
  href: string;
};

export const LINKS: Link[] = [
  { label: "site", value: "christophe.ribeiro.io", href: "https://christophe.ribeiro.io" },
  { label: "email", value: "christophe@ribeiro.io", href: "mailto:christophe@ribeiro.io" },
  { label: "x", value: "@christoribeiro", href: "https://x.com/christoribeiro" },
  { label: "github", value: "@christoribeiro", href: "https://github.com/christoribeiro" },
  { label: "linkedin", value: "@christoribeiro", href: "https://linkedin.com/in/christoribeiro" },
];
```

- [ ] **Step 2: `apps/web/components/Hero.tsx`**

```tsx
export function Hero() {
  return (
    <header className="flex flex-col gap-3">
      <h1 className="bg-gradient-to-r from-amber to-pink bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
        Christophe Ribeiro
      </h1>
      <p className="font-mono text-sky">Entrepreneur &amp; Software Engineer</p>
    </header>
  );
}
```

- [ ] **Step 3: `apps/web/components/Links.tsx`**

```tsx
import { LINKS } from "@/lib/links";

export function Links() {
  return (
    <nav aria-label="Liens" className="flex flex-col gap-2">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="group flex items-baseline gap-3 font-mono text-muted transition-colors hover:text-star"
        >
          <span className="w-20 text-amber">{link.label}</span>
          <span className="group-hover:text-sky">{link.value}</span>
        </a>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: `apps/web/app/page.tsx` (composition finale)**

```tsx
import { Hero } from "@/components/Hero";
import { Links } from "@/components/Links";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-10 px-6 py-16">
      <Hero />

      <section className="max-w-prose text-sky">
        <p>
          Je construis des produits et des outils. Entrepreneur et ingénieur logiciel,
          basé en France.
        </p>
      </section>

      <Links />

      <footer className="font-mono text-sm text-muted">
        <span className="text-amber-dim">$</span> npx christo
      </footer>
    </main>
  );
}
```

- [ ] **Step 5: Vérifier le rendu (contenu servi)**

```bash
cd /Users/christophe/Developer/christo
pnpm --filter web dev &
DEV_PID=$!
sleep 6
curl -s http://localhost:3000 | grep -q "Christophe Ribeiro" && echo "OK: nom présent"
curl -s http://localhost:3000 | grep -q "npx christo" && echo "OK: clin d'œil présent"
curl -s http://localhost:3000 | grep -q "christophe.ribeiro.io" && echo "OK: liens présents"
kill $DEV_PID
```
Expected : les trois `OK:` s'affichent.

- [ ] **Step 6: Vérifier le build de prod**

```bash
pnpm --filter web build
```
Expected : `next build` réussit, `/` prérendue en statique.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Ajoute la landing v1 (hero, à propos, liens)"
```

---

### Task 5: Déploiement Vercel + domaine (runbook opérateur)

**Files:**
- Create: `apps/web/.vercelignore` (optionnel, propreté)

Cette tâche est **manuelle** (dashboard Vercel + DNS) — pas de test automatisé. Elle est réalisée par Christophe ; le plan fournit les étapes exactes.

**Interfaces:**
- Consumes : `apps/web` build (Task 3/4), `pnpm-lock.yaml` (racine).

- [ ] **Step 1: (Optionnel) `apps/web/.vercelignore`**

```
node_modules
.next
```

- [ ] **Step 2: Créer le projet Vercel**

- Vercel → New Project → importer le repo GitHub `ChristoRibeiro/christoribeiro`.
- **Root Directory = `apps/web`** (réglage clé du monorepo).
- Framework Preset : **Next.js** (auto-détecté).
- Package manager : pnpm (auto-détecté via `pnpm-lock.yaml` + `packageManager`). Vercel installe au niveau racine du workspace.
- Laisser Build/Install commands par défaut.

- [ ] **Step 3: Vérifier le preview deploy**

- Déclencher un déploiement (import initial ou push).
- Ouvrir l'URL `*.vercel.app` : la landing doit s'afficher (nom, liens, `npx christo`).
- Ne **pas** brancher le domaine tant que le preview n'est pas validé.

- [ ] **Step 4: Brancher le domaine**

- Vercel → Project → Settings → Domains → ajouter `christoribeiro.com` et `www.christoribeiro.com`.
- Suivre les instructions DNS de Vercel (A/ALIAS pour l'apex, CNAME pour `www`) chez le registrar.
- Attendre la propagation + le certificat TLS auto.

- [ ] **Step 5: (Si `.vercelignore` créé) Commit**

```bash
git add apps/web/.vercelignore
git commit -m "Ajoute .vercelignore pour le déploiement Vercel"
```

---

## Notes de vérification globale

- **CLI intact** : `node apps/cli/cli.js` rend la carte ; tarball via `npm pack --dry-run` contient `cli.js` + README + LICENSE.
- **Publication** : workflow au même chemin, publie depuis `apps/cli`, OIDC préservé (validé au prochain push `main`).
- **Site** : `pnpm --filter web build` passe ; `/` sert nom + liens + `npx christo` ; preview Vercel OK avant domaine.
