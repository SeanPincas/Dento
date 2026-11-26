import { prefersReducedMotion } from './motion'

// Scroll to a section by id. After a route change the section may not exist
// yet, so keep looking for a few frames before giving up.
export function scrollToSection(id, framesLeft = 30) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  } else if (framesLeft > 0) {
    requestAnimationFrame(() => scrollToSection(id, framesLeft - 1))
  }
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
