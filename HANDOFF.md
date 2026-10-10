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

## Done: the DOOM universe (replaced War Machine mode)

Shipped: `[ STARK | DOOM ]` switch with a portal/glitch transition (`components/Portal.tsx`), saved in localStorage and applied before first paint (inline script in `app/layout.tsx`). Doom palette + Cinzel via CSS variables in `app/globals.css`. An original 3D iron mask hero built in code (`components/three/DoomMask3D.tsx`, no model download). Doom intro, Doom copy for headings, nav, quotes, the AI log ("The Codex"), Snap ("Doom is eternal."), ID badge (royal seal) and certifications (Royal Decree with wax seal). All Doom copy lives in `doom` in `data/portfolio.ts`.

**Owner decision:** no Doombots. Doom's side of the Hall ("The Throne Room") shows one mask and lists the six projects as his works. Doom's own armour model is not needed.

Still Stark-only in Doom mode: the body text of Threats / Siege / Trials / Network / Chronicle / Contact sections, and the `/work/[slug]` pages.

## Original brief for the Doom task (kept for reference)

The owner wants two universes that never coexist, Tony Stark's and Doctor Doom's, switchable like the current mode toggle. **War Machine mode is removed** and replaced by Doom. (The War Machine *suit* in the Hall stays, as Sahayak's suit.)

### Agreed design
- **Nav toggle:** `[ STARK | DOOM ]`. Switching plays a glitch/portal transition and re-skins the whole site. Remember the choice in localStorage.
- **Doom palette:**
  - dark emerald green `#0f3d2a` / `#1f6b47`
  - glowing green `#3cff9a` for magic and eyes
  - iron grey `#6b6f75`
  - black
  - aged-gold trim `#b08d3c`
- **Hero:** an original iron mask (not Marvel art) with glowing green eyes and rotating mystic green runes, replacing the arc reactor. Green embers instead of gold sparks. Optional stone texture.
- **Fonts:** a gothic/regal serif for headings (e.g. Cinzel or UnifrakturCook) in Doom mode.
- **Voice:** Doom speaks in the third person, with the same facts reframed.
  - Headline: "Doom builds systems that need no one."
  - GhostOps: "Doom's machines repair themselves. Failure is not tolerated."
  - ResilientCommerce: "A fortress that does not fall, no matter how many come."
  - Orbit IDE: "Code that proves itself worthy before Doom looks at it."
  - Sahayak: "Doom feeds his people."
- **J.A.R.V.I.S. → Doom's AI:** cold, commanding log lines ("The Latverian network bows to its master").
- **Intro:** the mask forms from green sorcery and the eyes ignite.
- **Certifications:** a wax-sealed "Royal Decree of Latveria", with the same verify links.
- **Snap:** green mystic energy instead of Infinity Stones.
- **Recruiter brief:** stays neutral in both universes.
- Keep the three roles and all real facts. Only framing and visuals change.

### Doom's side of the Hall: one suit vs many
Tony has many suits; Doom has one. Recommended approach:
- **Centerpiece:** Doom's single armor on a throne platform. One 3D model, slowly rotating, in green and iron.
- **Projects as Doombots:** each project becomes a **Doombot** (Doom canonically builds armies of robot doubles), numbered by strength. Doombot-85 = GhostOps, … Doombot-1 = GreenCart.
- **Doombot models:** reuse the six existing suit models from `public/models/`, repainted iron-grey with green glowing eyes. The pipeline is the scratchpad script `process.mjs` (gltf-transform + sharp). It needs re-creating in a new session: repaint by texel class, keep shading, unify the finish, meshopt + WebP.
- **Doom's own armor:** ask the owner to download a **CC BY** "Doctor Doom" model from Sketchfab (filters: Downloadable + CC BY, under 200k triangles, glTF). If none suits, use a repainted suit with a green cloak, or keep the 3D mask as the centerpiece.
- **Section names in Doom mode:**
  - Hall of Armor → "The Throne Room"
  - Schematics → "Doom's Designs"
  - Training → "Doombot Trials"
  - Status → "Latverian Network"

### Implementation notes
- Generalise `Mode` in `components/Shell.tsx` from `"mark" | "warmachine"` to `"stark" | "doom"`. Drive the copy from a per-universe dictionary in `data/portfolio.ts`, e.g. `copy.stark` / `copy.doom`.
- 3D: add a `DoomMask3D` hero component and a Doom variant of `Hall3D`. Keep the lazy loading and `PerformanceMonitor` (the owner cares about lag).
- Test with Playwright plus SwiftShader. Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Run `next start` on a fresh port; an old server holding a port serves a stale build.
- If `git push` or the GitHub MCP returns 403 / "invalid session", PR creation still worked through `gh api repos/likith1231/portfolio/pulls`, and merging through `gh api -X PUT .../pulls/N/merge`.

## Other open items
- The three flagship projects are not deployed yet: Orbit IDE, GhostOps, ResilientCommerce. When they are, set `live` in `data/portfolio.ts`.
- The portfolio itself still needs connecting to Vercel (import the repo).
- Résumé: the Summary line still says "aspiring Software Development Engineer" (the owner may want it changed). The portfolio URL on the résumé is a Vercel preview URL.
- UML certificate (Infosys Springboard) has no verification link yet.
