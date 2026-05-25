# Space Vibe — Launch Dashboard

A quick-view landing page for space launches, stations, and a little personal NASA curiosity — built as a hands-on **vibe coding** experiment.

**Live demo:** [launch-dashboard-beta-six.vercel.app/launch](https://launch-dashboard-beta-six.vercel.app/launch)

## About this project

**Written with [Cursor](https://cursor.com) AI.** This app was developed conversationally: describing what I wanted, iterating in the editor, and letting the agent help wire up pages, APIs, and styling. It is meant to be a fun, informative showcase — not a production mission control system — and a record of my first serious attempt at vibe coding from scaffold to deploy.

The goal was a practical loop: **build a real web app locally, then ship it** (for example on [Vercel](https://vercel.com)) using modern React tooling without getting stuck in boilerplate.

## What this app does

**Space Vibe** is a single-page-style dashboard with a retro green theme. Use the top navigation to move between views:

| Section | Route | What you get |
|--------|--------|----------------|
| **Upcoming launches** | `/launch` | Live-ish schedule from [The Space Devs](https://thespacedevs.com/) Launch Library: countdown timers, a horizontal launch timeline, and cards for missions that are “Go for Launch.” Tap a card for launch detail. Data is cached in `localStorage` so refreshes are gentler on the API. |
| **Launch history** | `/launch-history` | Year-to-date launches with agency breakdowns and stacked bar charts (success vs failure) via Recharts. |
| **Space stations** | `/iss` | Side-by-side maps for the **ISS** and **Tianhe** (Tiangong core), plus expandable quick stats and fun facts. |
| **NASA** | `/nasa` | A light personal notes corner — ideas for what to explore next (Webb, astrophotography, and so on). |

The default route redirects to **Upcoming launches**, so the app opens on the countdown view.

Under the hood: **React 19**, **TypeScript**, **Vite**, **MUI**, **TanStack Query**, **React Router**, **MapLibre** / **react-map-gl**, and **Sass** modules. Public launch data comes from The Space Devs; station positions use proxied N2YO-style APIs where configured in `vercel.json`.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
pnpm build    # production build
pnpm preview  # preview the production build
pnpm lint     # ESLint
```

## Deploy

The project is set up for static hosting with SPA fallbacks and API rewrites in `vercel.json`. After connecting the repo to Vercel, a push to your main branch can deploy the `pnpm build` output automatically.

The current deployment is available at [https://launch-dashboard-beta-six.vercel.app/launch](https://launch-dashboard-beta-six.vercel.app/launch).

---

*Have fun exploring the schedule — and if something drifts from reality, blame the vibe coder, not the rockets.*
