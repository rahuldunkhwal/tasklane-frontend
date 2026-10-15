# Tasklane (frontend)

React app for Tasklane: Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, React Router.

> The API lives in a separate repository (`backend`). This README grows with each phase.

## Prerequisites

- Node.js **22.22+** (see `.nvmrc`)
- The backend running on `http://localhost:4000`

## Quick start

```bash
npm install
npm run dev               # http://localhost:5173
```

In development, Vite forwards every `/api/...` request to the backend on port 4000 (see `vite.config.ts`),
so the browser sees one site and the httpOnly auth cookie works with `SameSite=Lax`.

## Scripts

| Script              | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Dev server with hot reload         |
| `npm run build`     | Type-check, then build to `dist/`  |
| `npm run preview`   | Serve the production build locally |
| `npm run typecheck` | Type-check only                    |
| `npm run lint`      | ESLint                             |
| `npm run format`    | Format all files with Prettier     |

## Project structure
```
src/
├─ main.tsx              entry point
├─ app/                  app layer: router, providers, one thin file per page in routes/
├─ components/           shared UI: ui/ (shadcn) and layouts/
├─ lib/                  shared library setup (cn helper, later: API client, query client)
├─ types/                shared types
└─ features/<feature>/   everything for one feature: api/, components/, schemas
```

Imports flow one way: shared (`components`, `lib`, `types`) → `features` → `app`.
