# Likith Lochan — Portfolio

A black, Iron Man–inspired HUD portfolio for a DevOps / Backend / Applied AI engineer. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion** and **Lenis**.

## What's on it

| Feature | What it does |
|---|---|
| **Boot sequence** | A short HUD boot screen (once per session, skippable). |
| **Arc reactor hero** | An SVG reactor that tilts with the mouse and "charges" as you scroll. |
| **The Suits** | Flagship projects (GhostOps, Orbit IDE, ResilientCommerce) with a key number, stack and an animated pipeline diagram each. |
| **Schematics** | A page per project at `/work/<slug>`: problem, how it works, flight log, lesson learned. |
| **Incident Drill** | Inject a fault and watch a GhostOps-style agent pipeline diagnose, patch, validate and open a PR (or get blocked by policy). |
| **Rush Lab** | An autoscaling simulator modelled on the ResilientCommerce HPA (2→8 pods @ 60% CPU), including the real DB-pool lesson. |
| **System Status** | A status page; live projects are pinged from the visitor's browser. |
| **Command palette** | Press `/` or `Ctrl/⌘ + K` for a terminal: `help`, `whoami`, `ls`, `open ghostops`, `status`, `sudo hire likith`… |
| **Stealth ↔ Mark mode** | Black & steel by default; **Suit up** switches the accents to red & gold. |
| **Recruiter mode** | A 30-second brief with a "Copy summary" button. |
| **Easter egg** | ↑ ↑ ↓ ↓ ← → ← → B A |

## Editing content

Everything lives in **`data/portfolio.ts`**:

- **Deployed a project?** Set its `live` field to the URL. The card switches from *Deploying* to *Live*, gets a Live button, and the status board starts pinging it.
- **Résumé:** put the PDF in `public/` and set `profile.resume` to e.g. `"/Likith_Lochan_Resume.pdf"`.
- Projects, skills (`armory`), principles, missions and diagnostics are all plain arrays.

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
