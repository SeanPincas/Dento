import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { CATEGORY_JP as JAPANESE_NAMES } from '../../utils/dishSearch'
import CeramicPlate from '../ui/CeramicPlate/CeramicPlate'
import { ChevronIcon } from '../ui/Icons/Icons'
import { prefersReducedMotion } from '../../utils/motion'

export const SPEED = 58          // px per second while the belt runs on its own
export const SLAT = 60           // width of one belt slat in px (matches the CSS)
export const GLIDE_MS = 900      // length of the arrow glide (a full screen of plates)
export const RESUME_DELAY = 3000 // pause after an arrow click before the belt restarts

export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// One conveyor belt of category plates in front of a wooden counter.
// `direction` 1 runs right-to-left, -1 left-to-right. `copies` is how many
// times the plates are repeated so a short list still fills the screen
// while it loops (every copy after the first is hidden from screen readers).
// With showArrows false the parent drives it through ref.current.slide(step).
const KaitenBelt = forwardRef(({ items, category, onPick, direction = 1, copies = 2, label, className = '', showArrows = true }, ref) => {
  const trackRef = useRef(null)
  const beltRef = useRef(null)
  const windowRef = useRef(null)
  const belt = useRef({ offset: 0, hovered: false, resumeAt: 0, glide: null })

  // One animation loop drives both the plates and the belt slats, so they always
  // move together: on their own, during an arrow glide, and while paused.
  useEffect(() => {
    const state = belt.current
    const reduceMotion = prefersReducedMotion()
    let frame
    let last = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const track = trackRef.current
      const loopWidth = track ? track.scrollWidth / copies : 0

      if (state.glide) {
        const t = Math.min((now - state.glide.start) / GLIDE_MS, 1)
        state.offset = state.glide.from + (state.glide.to - state.glide.from) * easeInOut(t)
        if (t === 1) state.glide = null
      } else if (!reduceMotion && !state.hovered && now >= state.resumeAt) {
        state.offset += SPEED * dt * direction
      }

      if (loopWidth > 0) {
        const wrapped = ((state.offset % loopWidth) + loopWidth) % loopWidth
        track.style.transform = `translateX(${-wrapped}px)`
        if (beltRef.current) {
          beltRef.current.style.backgroundPositionX = `${-(((state.offset % SLAT) + SLAT) % SLAT)}px`
        }
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [direction, copies])

  const slide = (step) => {
    const state = belt.current
    const first = trackRef.current?.firstElementChild
    if (!first) return
    const plateWidth = first.offsetWidth + parseFloat(getComputedStyle(first).marginRight || 0)
    // Move a whole screen of plates, so every dish on view is replaced by the next set.
    const viewWidth = windowRef.current?.clientWidth ?? window.innerWidth
    const platesOnScreen = Math.max(1, Math.floor(viewWidth / plateWidth))
    const from = state.offset
    const to = (state.glide ? state.glide.to : from) + step * plateWidth * platesOnScreen
    const start = performance.now()
    state.glide = { from, to, start }
    state.resumeAt = start + GLIDE_MS + RESUME_DELAY
  }

  useImperativeHandle(ref, () => ({ slide }))

  const setHovered = (value) => { belt.current.hovered = value }

  const renderPlates = (copy) =>
    items.map((item) => (
      <KaitenDish
        key={`${copy}-${item.menu_name}`}
        item={item}
        active={category === item.menu_name}
        hidden={copy > 0}
        onPick={onPick}
      />
    ))

  return (
    <div className={`kaiten-bar ${className}`} role='group' aria-label={label}>
      <div className='kaiten-belt' aria-hidden='true'>
        <div className='kaiten-belt-surface' ref={beltRef} />
      </div>
      {showArrows && <KaitenArrows onSlide={slide} />}
      {/* Hovering or focusing a plate holds the belt still; the arrows do not,
          so the belt always restarts 3 seconds after an arrow click. */}
      <div
        className='kaiten-window'
        ref={windowRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <div className='kaiten-track' ref={trackRef}>
          {Array.from({ length: copies }, (_, copy) => renderPlates(copy))}
        </div>
      </div>
      <div className='kaiten-counter' aria-hidden='true' />
    </div>
  )
})

// One plate with its name tag. Repeated copies (hidden) are skipped by
// screen readers and the keyboard.
export const KaitenDish = ({ item, active, hidden, onPick, style, dishRef }) => (
  <button
    ref={dishRef}
    type='button'
    className={`kaiten-dish${active ? ' active' : ''}`}
    style={style}
    onClick={(e) => onPick(item, e.currentTarget)}
    aria-pressed={hidden ? undefined : active}
    aria-hidden={hidden ? true : undefined}
    tabIndex={hidden ? -1 : undefined}
  >
    <CeramicPlate src={item.menu_image} className='kaiten-plate' />
    <span className='kaiten-tag'>
      <span className='kaiten-tag-jp'>{JAPANESE_NAMES[item.menu_name] ?? ''}</span>
      <span className='kaiten-tag-name'>{item.menu_name}</span>
    </span>
  </button>
)

// Previous / next buttons: each glides a full screen of plates.
export const KaitenArrows = ({ onSlide }) => (
  <>
    <button type='button' className='kaiten-arrow kaiten-arrow-left' aria-label='Previous categories' onClick={() => onSlide(-1)}>
      <ChevronIcon direction='left' size={22} />
    </button>
    <button type='button' className='kaiten-arrow kaiten-arrow-right' aria-label='Next categories' onClick={() => onSlide(1)}>
      <ChevronIcon direction='right' size={22} />
    </button>
  </>
)

export default KaitenBelt
