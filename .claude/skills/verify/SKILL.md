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

- Click a shape → navigates to its page.
- Hover a shape → `.label` fades to opacity 1; first Tab focuses the heart link.
- After load, all three `/video/*.mp4` are fetched in the background. Hover a shape → its `video[data-reel]` fades in and plays; leave → it pauses ~300ms later and resumes from there on the next hover. A touch context (`hasTouch`, `isMobile`) must make zero `/video/` requests.

## Gotchas

- Shapes are vw/vh positioned, so screenshots at different viewport sizes shift them. Use a fixed viewport (1400x900) for comparisons.
