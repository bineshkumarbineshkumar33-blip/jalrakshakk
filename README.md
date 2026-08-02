# JalRakshak v2 — AI Water Pollution Response Platform

Built for Idea2Impact 2026 (NxtWave) · Theme: Clean & Green Technology

## What's new in this round
- **Login / Signup** — personal accounts, points and history tied to your profile
- **Recycle** (replaces the old Report page) — AI photo classification now also
  determines Recyclable vs Non-recyclable and shows the disposal route
- **Management** — field team roster maintaining the boat fleet, live boat
  status, and a Help Center for user doubts
- **Services** — boat availability, how many sites cleaned/pending per day,
  and the reported-vs-cleaned trend over time
- **Incentives Board** — points, Guardian tiers, and a rewards store (real
  rewards unlock at point thresholds, including recycled-material furniture)
- **Profile** — your own tier, points, and report history

## Core AI (unchanged, still the heart of the app)
MobileNet + KNN transfer learning trains live in your browser on the Recycle
page — no dataset, no server. Everything is client-side, persisted to
`localStorage`, deployable as a static site with zero backend.

## Run locally
```bash
npm install
npm run dev
```

## Deploy
```bash
npm i -g vercel
vercel --prod
```
or `npm run build` and drag the `dist/` folder to https://app.netlify.com/drop

## Notes
- Field team names/phone numbers in `src/lib/teams.js` are demo placeholders.
- Login is client-side only (localStorage) for demo purposes — do not reuse a real password.
- Points/leaderboard are keyed by account name, shared across all reports made by that account.

## Tech stack
React (Vite) · TensorFlow.js (MobileNet + KNN) · react-leaflet / OpenStreetMap · Tailwind CSS
