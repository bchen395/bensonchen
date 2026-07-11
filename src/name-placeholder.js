// Name lockup: the real handwritten signature (scan of a smudged pen note),
// keyed to transparent and tinted to --ink-black in public/name.png. The smear
// is baked into the image, so no CSS smudge filter or ghost layer is needed.
export function mountName(slot) {
  const img = document.createElement('img')
  img.className = 'name'
  img.src = '/name.png'
  img.alt = 'Benson Chen'
  slot.append(img)
}
