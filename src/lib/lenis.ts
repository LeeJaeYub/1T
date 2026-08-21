import type Lenis from 'lenis'

// Module-level handle so anything that locks the page (the lightbox) can
// pause the smooth scroller without threading a provider through the tree.
let instance: Lenis | null = null

export function setLenis(next: Lenis | null) {
  instance = next
}

export function getLenis() {
  return instance
}
