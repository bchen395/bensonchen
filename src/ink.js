import { getStroke } from 'perfect-freehand'

// Felt-tip feel: speed-based thinning, heavy smoothing so mouse jitter disappears.
const OPTIONS = {
  size: 9,
  thinning: 0.65,
  smoothing: 0.6,
  streamline: 0.5,
  simulatePressure: true,
}

// Points are [x, y, pressure]. Returns an SVG path `d` for the filled stroke outline.
export function strokePathData(points) {
  const outline = getStroke(points, OPTIONS)
  if (outline.length < 4) return ''
  let d = `M ${outline[0][0].toFixed(1)} ${outline[0][1].toFixed(1)} Q`
  for (let i = 0; i < outline.length; i++) {
    const [x0, y0] = outline[i]
    const [x1, y1] = outline[(i + 1) % outline.length]
    d += ` ${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`
  }
  return d + ' Z'
}
