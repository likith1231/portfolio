# Portfolio handoff brief

Read this first in a new session. Owner: Likith Lochan (GitHub `likith1231`, repo `likith1231/portfolio`, branch `main`).

## What exists (all merged to `main`)

Next.js 14 + TypeScript + Tailwind + Framer Motion + React Three Fiber. All content lives in **`data/portfolio.ts`**.

- **Theme:** Iron Man. Red/gold/black, with blue used only in the arc reactor. Editorial look: italic gold accent words, pill buttons, rounded cards.
- **Intro:** the arc reactor assembles as the loader, then a faceplate transition.
- **Hero:** a 3D arc reactor model, the headline "I build systems that fix *themselves*", a Tony quote card and a stats row.
- **Hall of Armor:** six realistic 3D suits (CC BY Sketchfab models, repainted and compressed in `public/models/`), ranked by project strength:
  - Mark 85 = GhostOps
  - Mark 50 = Orbit IDE
  - Mark 44 Hulkbuster = ResilientCommerce
  - War Machine = Sahayak
  - Mark 7 = Project Management
  - Mark 1 = GreenCart
- **Other sections:**
  - Schematics (pipelines)
  - Threats (incident drill)
  - Stress test (autoscaler)
  - Training room (bug-drone game)
  - Suit status (live pings)
  - Pilot (Stark Industries ID badge, education card, radar, GitHub heatmap, skills arsenal)
  - Flight Log (timeline from the résumé)
  - Certifications (S.H.I.E.L.D. dossier with verify links)
  - Contact
- **Extras:**
  - J.A.R.V.I.S. (an activity log and protocols; no chat, no voice)
  - The Snap (corner gauntlet; half the page turns to dust and ends on "I am Iron Man")
  - Repulsor clicks, flight HUD, synthesised sounds, recruiter brief, résumé PDF
- **Mode toggle:** currently "Classic ↔ War Machine". It sets `data-mode` on `<html>` and swaps the CSS colour variables `--gold` and `--hot` (see `app/globals.css` and `components/Shell.tsx`).
- **Rules the owner gave:**
  - Show only three roles: DevOps Engineer, Full Stack Developer, AI/ML Engineer.
  - Use realistic visuals, not cartoon.
  - No talking or chat assistant.
  - Always **show a screenshot preview before opening a PR**, then open the PR and merge it into `main`.
  - Credit every CC BY model in the footer (`modelCredits`).

## Current state (Oct 2026)

- **Doom universe: built, then removed at the owner's request.** The site is Iron Man only (the Classic ↔ War Machine finish toggle is back, as before).
- **Bento redesign, modelled on kashyaprayas.com:** every section is a grid of tiles (`.tile` in `app/globals.css`) with gold corner rivets. New pieces:
  - Hero bento: headline, typewriter narrator intro with a `[ muted ]` gag, local time, 3D reactor tile, a live "restyle the headline" font picker, dot-matrix stat tiles (`components/ui/DotMatrix.tsx`).
  - `PilotNote`: third-person pilot's note, "cards collected" counter and a fanned deck of certificates linking to the dossier.
  - Works (`HallOfArmor`): project list on the left, a sticky 3D suit stand on the right (`SuitViewer`).
  - `Interlude`: the site's single movie line plus a live "time spent on this website" counter.
  - About, Contact and Footer rebuilt as bento tiles (objective, descriptive, building now, mission checklist, big email tile, nav/social tiles, studded plate).
  - Nav shows five code-tag links: `<HOME/> <WORK/> <LAB/> <ABOUT/> <CONTACT/>`.
- **One movie line only:** `quote` in `data/portfolio.ts` ("Sometimes you gotta run before you can walk.", Tony Stark, Iron Man 2008), chosen to match the owner's "ship first, then armor it" approach. It is shown in the interlude and at the end of the Snap. All other film quotes were removed.
- Floating embers drift behind the whole site (`components/ui/Embers.tsx`).

## Other open items
- The three flagship projects are not deployed yet: Orbit IDE, GhostOps, ResilientCommerce. When they are, set `live` in `data/portfolio.ts`.
- The portfolio itself still needs connecting to Vercel (import the repo).
- Résumé: the Summary line still says "aspiring Software Development Engineer" (the owner may want it changed). The portfolio URL on the résumé is a Vercel preview URL.
- UML certificate (Infosys Springboard) has no verification link yet.
