// Placeholder name lockup: handwriting font pushed through the #smudge SVG
// filter (defined in index.html) plus a blurred ghost for the smear.
// To swap in the real handwritten scan: replace this markup with
// <img src="/name.svg" alt="Benson Chen"> (or inline SVG) and drop the filter.
// Nothing else references this module.
export function mountName(slot) {
  const h1 = document.createElement('h1')
  h1.className = 'name'
  h1.dataset.text = 'Benson Chen'
  h1.textContent = 'Benson Chen'
  slot.append(h1)
}
