import '@fontsource/caveat/400.css'
import '@fontsource/caveat/700.css'
import './style.css'
import { mountName } from './name-placeholder.js'

mountName(document.getElementById('name-slot'))

// ---------- hover footage ----------

const FADE_MS = 300 // matches the .reel opacity transition

// Mirrors the CSS media query: touch screens never fetch footage.
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const reels = [...document.querySelectorAll('video[data-reel]')]

function loadReel(video) {
  if (video.src) return
  video.preload = 'auto'
  video.src = `/video/${video.dataset.reel}.mp4`
}

if (canHover) {
  for (const video of reels) video.poster = `/video/${video.dataset.reel}.jpg`
}

// Reduced motion keeps the still frame; everyone else gets the loop.
if (canHover && !reduceMotion) {
  // Fetch in the background once the page has settled, so hovers are instant.
  window.addEventListener('load', () => {
    const loadAll = () => reels.forEach(loadReel)
    if ('requestIdleCallback' in window) requestIdleCallback(loadAll)
    else setTimeout(loadAll, 200)
  })

  for (const video of reels) {
    const shape = video.closest('.shape')
    let pauseTimer

    // Pausing (not resetting) means the next hover picks up where this one left off.
    const show = () => {
      clearTimeout(pauseTimer)
      loadReel(video)
      video.play().catch(() => {})
    }
    const hide = () => {
      pauseTimer = setTimeout(() => video.pause(), FADE_MS)
    }

    shape.addEventListener('pointerenter', show)
    shape.addEventListener('pointerleave', hide)
    shape.addEventListener('focus', show)
    shape.addEventListener('blur', hide)
  }
}
