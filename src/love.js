import '@fontsource/caveat/400.css'
import '@fontsource/caveat/700.css'
import './style.css'
import { pieces } from './love-data.js'

const stage = document.getElementById('piece')
const button = document.getElementById('another')

// ---------- deal from a shuffled deck so nothing repeats until all 32 are seen ----------

let deck = []

function shuffled(array) {
  const out = [...array]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function nextPiece(previous) {
  if (deck.length === 0) {
    deck = shuffled(pieces)
    // a reshuffle shouldn't hand back the card still on screen
    if (previous && deck[0] === previous && deck.length > 1) {
      ;[deck[0], deck[1]] = [deck[1], deck[0]]
    }
  }
  return deck.shift()
}

// ---------- rendering ----------

const el = (tag, className, text) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

function caption(title, note) {
  const box = el('div', 'piece-caption')
  box.append(el('h2', 'piece-title', title))
  if (note) box.append(el('p', 'piece-note', note))
  return box
}

// hqdefault always exists for a public video; CSS crops its letterbox bars to 16:9
const thumbnailUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

function renderImage(piece) {
  const frame = el('div', 'piece-media')
  const img = el('img')
  img.src = piece.src
  img.alt = piece.title
  frame.append(img)
  return [frame, caption(piece.title, piece.note)]
}

function renderLink(piece) {
  const frame = el('div', 'piece-media piece-media-text')
  const link = el('a', 'piece-link', piece.title)
  link.href = piece.url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  frame.append(link)
  return [frame, caption('read it ↗', piece.note)]
}

function renderQuote(piece) {
  const frame = el('div', 'piece-media piece-media-text')
  frame.append(el('blockquote', 'piece-quote', piece.text))
  return [frame, caption(`— ${piece.author}`)]
}

function renderVideo(piece) {
  const frame = el('button', 'piece-media piece-video')
  frame.type = 'button'
  frame.setAttribute('aria-label', `Play ${piece.title}`)

  const img = el('img')
  img.src = thumbnailUrl(piece.embedId)
  img.alt = ''
  frame.append(img, el('span', 'piece-play'))

  frame.addEventListener('click', () => {
    const player = el('div', 'piece-media')
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube.com/embed/${piece.embedId}?autoplay=1`
    iframe.title = piece.title
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    iframe.allowFullscreen = true
    player.append(iframe)
    frame.replaceWith(player)
  })

  return [frame, caption(piece.title)]
}

const renderers = {
  image: renderImage,
  link: renderLink,
  quote: renderQuote,
  video: renderVideo,
}

let showing = null

function show() {
  showing = nextPiece(showing)
  stage.dataset.kind = showing.kind
  stage.replaceChildren(...renderers[showing.kind](showing))
}

button.addEventListener('click', show)
show()
