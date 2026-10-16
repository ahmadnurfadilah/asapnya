## Learned User Preferences

- Keep the UI minimal: one screen on desktop without scroll (breakpoint around 900px); on mobile, upload/preview must be the topmost block.
- Use Indonesian copy that reminds people karhutla still affects health, environment, and our shared future—not a heavy photo-editing app feel.
- Do not name public figures in the UI; tweet credit only as a subtle footer link labeled «Inspirasi», not in the hero.
- Avoid long explicit disclaimers in the footer; prefer short, subdued links with an external-link (arrow up-right) icon.
- Footer should pair «Inspirasi» with the open-source «GitHub» repo link.
- Match PRD.md for scope, privacy messaging, and campaign tone; polish visual design to the karhutla/smoky theme.

## Learned Workspace Facts

- Asapnya is a Vite + React + TypeScript client-only app; images are processed entirely in the browser via the Canvas API.
- Smoke overlay asset lives at `public/img/cover.webp` (`OVERLAY_SRC` in `src/lib/constants.ts`).
- Export is square 1080×1080 PNG; uploads accept JPEG/PNG/WebP/GIF up to 10 MB.
- `index.html` CSP must include `style-src 'unsafe-inline'` and `connect-src` with `ws:` / `wss:` so Vite dev CSS injection and HMR work.
- External and campaign strings are centralized in `src/lib/constants.ts` (`INSPIRATION_TWEET_URL`, `GITHUB_REPO_URL`, `CAMPAIGN_CAPTION`, etc.).
- Product requirements and MVP boundaries are defined in `PRD.md`.
