# Concert Dashboard

Internal concert tracking dashboard built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style components, and Vercel Postgres (Neon).

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Configure database:

- The project uses Vercel Postgres (Neon). The database is linked via the Vercel dashboard (Storage tab).
- Run `vercel env pull .env.local` to get the connection string locally.

3. Seed the database:

```bash
npm run db:seed
```

4. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000, sign in at `/login` with `sa`/`sa`, then use the dashboard, concerts list, and New Concert form.

## Design system & colors

The UI is built on a small Coven design system defined in `app/globals.css` and wired into Tailwind via `tailwind.config.ts`.

- **Stone primary palette**
  - `--coven-primary`: `#B1A79A` (stone accent, used for CTAs and highlights)
  - `--coven-primary-hover`: `#A29788`
- **Surfaces & text**
  - `--coven-bg`: `#0A0A0B` (app background)
  - `--coven-surface`: `#121214` (cards, panels like the login box and dashboard cards)
  - `--coven-text`: `#E8E0CF`
- **Borders & active states**
  - `--coven-border`: `rgba(177, 167, 154, 0.28)`
  - `--coven-border-strong`: `rgba(177, 167, 154, 0.42)`
  - `--coven-active`: `rgba(177, 167, 154, 0.14)`

Tailwind color utilities (`bg-coven-*`, `text-coven-*`, `border-coven-*`) are mapped to these tokens in `tailwind.config.ts`, so the **dashboard pages automatically share the same stone-based styling as the login screen**. Buttons, inputs, cards, sidebar, and top bar all use these coven colors; new components should also stick to these utilities rather than hard-coded hex values.

## Deployment on Vercel

1. The project is linked to Vercel with a Neon Postgres database (auto-injected env vars).
2. Push to `main` → auto-deploy to https://satans-alter.vercel.app.
3. Visit `/login` and sign in with `sa`/`sa`.
