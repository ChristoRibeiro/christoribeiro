# christoribeiro

Repo personnel de Christophe Ribeiro — deux projets indépendants, sans monorepo :

- [`cli`](./cli) — carte de visite terminal (`npx christo` / `npx christoribeiro`), publiée sur npm.
- [`web`](./web) — site personnel Next.js, déployé sur Vercel (christoribeiro.com).

Chaque dossier est autonome (son propre `package.json` + `pnpm-lock.yaml`) :

```bash
cd cli && pnpm install && node cli.js      # lance le CLI
cd web && pnpm install && pnpm dev         # site Next.js — http://localhost:3000
```
