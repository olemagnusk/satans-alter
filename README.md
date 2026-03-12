# Concert Dashboard

Internal concert tracking dashboard built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style components, and Supabase (auth, Postgres, storage).

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Configure Supabase:

- Create a project at https://supabase.com.
- In the SQL editor, apply `supabase/concerts_schema.sql` to create the `concerts` table.
- Create a storage bucket named `concert-images` (public or with signed URLs).
- Create a shared email/password user in Supabase Auth for internal access.

3. Environment variables:

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000, sign in at `/login` with the shared credentials, then use the dashboard, concerts list, and New Concert form.

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

1. Create a new Vercel project pointing to this repository.
2. In Vercel project settings, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Deploy. After the first deployment:

- Visit `/login` and sign in with the shared Supabase user.
- Create several concerts (including images from iPhone/Android).
- Verify:
  - New Concert form saves successfully.
  - Images appear in the Supabase `concert-images` bucket.
  - Concerts table shows entries.
  - Dashboard, Statistics, and Insights pages reflect the new data.

