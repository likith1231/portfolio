# Likith Lochan — Portfolio

An Iron Man–themed 3D portfolio for a DevOps / Backend / Applied AI engineer. Classic red & gold on black, with a War Machine (gunmetal) mode. Built with **Next.js 14**, **TypeScript**, **Three.js / React Three Fiber**, **Tailwind CSS** and **Framer Motion**.

## What's on it

| Feature | What it does |
|---|---|
| **Suit-up intro** | An arc reactor assembles itself as the loader while J.A.R.V.I.S. boots; then a faceplate closes and opens onto the site. Choose "Suit up · sound on" or "Enter silently". |
| **3D arc reactor** | The hero reactor flies together piece by piece, follows the mouse and glows brighter as you scroll. |
| **Hall of Armor (3D)** | Six procedural suits, Mark I–VI, ranked by project strength (Mark VI = strongest). Drag, use arrows, or pick a Mark. |
| **Schematics** | The three flagship suits opened up, with their real pipelines. Every suit has its own page with a 3D turntable. |
| **J.A.R.V.I.S.** | Runs in the background: a live activity log, real gauges (fps, page load, sectors explored), and protocols (War Machine, Unibeam, EMP, Reboot). |
| **Threat response** | Inject a fault and watch a GhostOps-style agent pipeline handle it. |
| **Stress test** | An autoscaling simulator modelled on the ResilientCommerce HPA. |
| **Training room** | A mini game: shoot bug-drones before they reach production. Ranks from DUM-E to Iron Legion. |
| **Suit status** | Live projects pinged from the visitor's browser, plus a mission log. |
| **Pilot profile** | Diagnostics radar, GitHub contributions as "reactor output", and the War Machine arsenal. |
| **Mechanical extras** | Repulsor blasts (click empty space; hold to charge), flight HUD, synthesised suit sounds, EMP button, Unibeam easter egg (↑↑↓↓←→←→BA), Iron Man film quotes. |

## Editing content

Everything lives in **`data/portfolio.ts`**:

- **Deployed a project?** Set its suit's `live` field to the URL. It switches from *Deploying* to *Live* everywhere, and J.A.R.V.I.S. starts pinging it.
- **Résumé:** put the PDF in `public/` and set `profile.resume` to e.g. `"/Likith_Lochan_Resume.pdf"`.
- Suits (projects), `arsenal` (skills), principles, missions, quotes and diagnostics are all plain arrays.
- **Reorder the suits:** change each suit's `mark` number. Higher Mark = stronger.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected). No environment variables needed.
4. Deploy.
