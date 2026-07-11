---
name: verify
description: Build, run, and drive this site to verify changes end-to-end in a real browser.
---

# Verifying this site

Static Vite site (vanilla JS). The surface is browser pixels + pointer interaction.

## Build & launch

```bash
npm run dev          # dev server on http://localhost:5173 (run in background)
npm run build        # production build to dist/
```

## Drive it

No test runner. Drive with Playwright against installed Chrome (no browser download needed):

```bash
# in a scratch dir: npm i playwright
# launch with: chromium.launch({ channel: 'chrome' })
```

Flows worth driving on the front page:

- Drag starting on heart / star / note / empty paper → stroke colored `#d1342f` / `#e6a817` / `#1c1b19` / `#1c1b19`, appended as `<path>` inside `#ink`. Ink may spill anywhere (unclipped by design).
- Quick click (< 5px movement) on a shape → navigates to its page; any drag ≥ 5px must NOT navigate.
- Reload → strokes restored from localStorage key `bensonchen:ink:v1`.
- Cmd/Ctrl+Z → removes last stroke only. "erase" button → clears strokes + storage.
- Hover a shape → `.label` fades to opacity 1; first Tab focuses the heart link.

## Gotchas

- Strokes are stored in viewport px; screenshots at different viewport sizes shift shape positions (they're vw/vh positioned). Use a fixed viewport (1400x900) for comparisons.
- Playwright's `page.mouse.click()` has no movement, so it exercises the navigate path; use manual `mouse.down()/move()/up()` sequences for the draw path.
