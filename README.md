# Tasklane (frontend)

React app for Tasklane: Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, React Router, TanStack Query.

> **Live app:** https://tasklane-frontend.vercel.app · **Live API:** https://tasklane-backend-md7v.onrender.com/api/health
> (Render free tier: the first request after ~15 min idle takes 30–60 s) ·
> **Backend repo:** https://github.com/rahuldunkhwal/tasklane-backend

## Prerequisites

- Node.js **22.22+** (see `.nvmrc`)
- The backend running on `http://localhost:4000` (see its README)

## Quick start

```bash
npm install
npm run dev               # http://localhost:5173
```

In development, Vite forwards every `/api/...` request to the backend on port 4000 (see `vite.config.ts`),
so the browser sees one site and the httpOnly auth cookie works with `SameSite=Lax`.

There are **no frontend environment variables**: the app always calls a relative `/api`, and the host decides
where that goes (Vite proxy in development, a rewrite in production — see Deployment).

## Scripts

| Script              | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Dev server with hot reload         |
| `npm run build`     | Type-check, then build to `dist/`  |
| `npm run preview`   | Serve the production build locally |
| `npm run typecheck` | Type-check only                    |
| `npm run lint`      | ESLint                             |
| `npm run format`    | Format all files with Prettier     |

## Pages

| Route              | Access      | What it does                                                                                   |
| ------------------ | ----------- | ---------------------------------------------------------------------------------------------- |
| `/login`, `/signup` | logged-out | Email + password forms with validation; logged-in users are sent to Home                        |
| `/forgot-password`, `/reset-password` | logged-out | Request a reset email, then choose a new password from the emailed link       |
| `/`                | logged-in   | Home: total / completed / overdue counts and a grid of your boards                             |
| `/boards`          | logged-in   | Boards as lanes: board and task CRUD, drag & drop (within and between boards), search + filters |
| `/profile`         | logged-in   | Display name, profile picture (upload with crop), change password                              |
| `/invite/:token`   | public      | Landing page for an emailed board invite: sign up / log in with the invited email, then join   |

## Deployment

Hosted on Vercel as a static build. `vercel.json` does two things: it rewrites `/api/*` to the Render backend
(so the auth cookie stays first-party in production, exactly like the Vite proxy in development) and serves
`index.html` for every other path so client-side routes work on refresh. It also sets a few security headers.
Deploys happen automatically from `main`.

## Project structure

```
src/
├─ main.tsx              entry point
├─ app/                  app layer: router, providers, one thin file per page in routes/
├─ components/           shared UI: ui/ (shadcn) and layouts/
├─ lib/                  shared setup: API client (axios + 401 handling), query client, validation, helpers
├─ types/                shared API types
└─ features/<feature>/   everything for one feature: api/ (one file per endpoint), components/, schemas
```

Imports flow one way: shared (`components`, `lib`, `types`) → `features` → `app`.
