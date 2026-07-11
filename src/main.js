import '@fontsource/caveat/400.css'
import '@fontsource/caveat/700.css'
import './style.css'
import { strokePathData } from './ink.js'
import { mountName } from './name-placeholder.js'

mountName(document.getElementById('name-slot'))

const SVG_NS = 'http://www.w3.org/2000/svg'
const STORAGE_KEY = 'bensonchen:ink:v1'
const CLICK_SLOP = 5 // px of movement before a press becomes a stroke
const HALO = 20 // px around a shape that still picks up its ink color
const DEFAULT_INK = '#1c1b19'

const inkLayer = document.getElementById('ink')
const shapes = [...document.querySelectorAll('a[data-ink]')]

// ---------- stroke rendering ----------

function makePath(stroke) {
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('fill', stroke.color)
  path.setAttribute('fill-opacity', '0.9')
  path.setAttribute('d', strokePathData(stroke.points))
  return path
}

// ---------- persistence ----------

function loadStrokes() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(data?.strokes) ? data.strokes : []
  } catch {
    return []
  }
}

function saveStrokes() {
  try {
    const compact = strokes.map(({ color, points }) => ({
      color,
      points: points.map(([x, y, p]) => [
        Math.round(x * 10) / 10,
        Math.round(y * 10) / 10,
        Math.round(p * 100) / 100,
      ]),
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, strokes: compact }))
  } catch {
    // storage full or unavailable: drawing still works, it just won't persist
  }
}

const strokes = loadStrokes()
for (const stroke of strokes) {
  stroke.el = makePath(stroke)
  inkLayer.append(stroke.el)
}

// ---------- ink color: the shape you start on (or near) is the ink pot ----------

function inkColorAt(x, y, target) {
  const hit = target instanceof Element && target.closest('a[data-ink]')
  if (hit) return hit.dataset.ink

  let best = null
  let bestDist = Infinity
  for (const shape of shapes) {
    const r = shape.getBoundingClientRect()
    if (x < r.left - HALO || x > r.right + HALO || y < r.top - HALO || y > r.bottom + HALO) continue
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dist = Math.hypot(x - cx, y - cy)
    if (dist < bestDist) {
      bestDist = dist
      best = shape
    }
  }
  return best ? best.dataset.ink : DEFAULT_INK
}

// ---------- pointer handling: tap = navigate, drag = draw ----------

let current = null // pen-down state for the active pointer
let suppressClick = false // set once a press turns into a stroke

window.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 || current) return
  if (e.target instanceof Element && e.target.closest('[data-no-draw]')) return
  current = {
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    color: inkColorAt(e.clientX, e.clientY, e.target),
    points: [[e.clientX, e.clientY, e.pressure || 0.5]],
    drawing: false,
    el: null,
  }
})

window.addEventListener('pointermove', (e) => {
  if (!current || e.pointerId !== current.pointerId) return

  if (!current.drawing) {
    if (Math.hypot(e.clientX - current.startX, e.clientY - current.startY) < CLICK_SLOP) return
    current.drawing = true
    suppressClick = true
    current.el = makePath(current)
    inkLayer.append(current.el)
  }

  const events = e.getCoalescedEvents?.() ?? [e]
  for (const ev of events) {
    current.points.push([ev.clientX, ev.clientY, ev.pressure || 0.5])
  }
  current.el.setAttribute('d', strokePathData(current.points))
})

function finishStroke(e) {
  if (!current || e.pointerId !== current.pointerId) return
  if (current.drawing) {
    strokes.push({ color: current.color, points: current.points, el: current.el })
    saveStrokes()
  }
  current = null
}

window.addEventListener('pointerup', finishStroke)
window.addEventListener('pointercancel', finishStroke)

// A press that became a stroke must never navigate; click fires after pointerup.
window.addEventListener(
  'click',
  (e) => {
    if (suppressClick) {
      e.preventDefault()
      e.stopPropagation()
      suppressClick = false
    }
  },
  true
)

// Anchors are natively draggable, which would eat pointermove events.
window.addEventListener('dragstart', (e) => e.preventDefault())

// ---------- erase + undo ----------

function removeLastStroke() {
  const stroke = strokes.pop()
  if (!stroke) return
  stroke.el.remove()
  saveStrokes()
}

document.getElementById('erase').addEventListener('click', () => {
  strokes.length = 0
  inkLayer.replaceChildren()
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
})

window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    removeLastStroke()
  }
})
