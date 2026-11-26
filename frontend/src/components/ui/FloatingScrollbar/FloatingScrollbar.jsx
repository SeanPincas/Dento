import React, { useCallback, useEffect, useRef, useState } from 'react'
import './FloatingScrollbar.css'

const EDGE_GAP = 8      // px gap above and below the knob's travel
const IDLE_MS = 1200    // fade back to idle this long after scrolling stops
const ROLL_DEG_PER_PX = -0.25 // the roll turns (anticlockwise going down) as the page scrolls

// The page scrollbar as a small maki roll (public/scroll/maki-knob.webp) that
// floats over the page instead of taking a strip of width. The browser's own
// page scrollbar is hidden in index.css; wheel, keyboard, touch and trackpad
// scrolling are untouched. The roll shows where you are, turns as you scroll
// and can be dragged. It rides the right edge on every screen size;
// it stops above the bottom nav. Decorative for assistive tech.
const FloatingScrollbar = () => {
  const [pos, setPos] = useState({ top: 0, visible: false, roll: 0 })
  const [active, setActive] = useState(false)
  const knobRef = useRef(null)
  const drag = useRef(null)
  const idleTimer = useRef(null)

  // Space the knob can travel in: the window minus the bottom nav (if shown).
  const travel = () => {
    const size = knobRef.current?.offsetHeight || 46
    const bottomNav = document.querySelector('.bottom-nav')?.offsetHeight || 0
    return { size, length: window.innerHeight - bottomNav - EDGE_GAP * 2 - size }
  }

  const measure = useCallback(() => {
    const root = document.documentElement
    const scrollable = root.scrollHeight - window.innerHeight
    if (scrollable <= 1) {
      setPos((p) => (p.visible ? { ...p, visible: false } : p))
      return
    }
    const { length } = travel()
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable))
    setPos({ top: EDGE_GAP + progress * Math.max(0, length), visible: true, roll: window.scrollY * ROLL_DEG_PER_PX })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      measure()
      setActive(true)
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setActive(false), IDLE_MS)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    // Page length changes as menus, images and dishes load.
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      observer.disconnect()
      clearTimeout(idleTimer.current)
    }
  }, [measure])

  // The knob only exists once the page scrolls; measure again when it appears
  // so its real size (it differs per screen size) is used.
  useEffect(() => { if (pos.visible) measure() }, [pos.visible, measure])

  const onPointerDown = (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { startY: e.clientY, startScroll: window.scrollY }
  }

  const onPointerMove = (e) => {
    if (!drag.current) return
    const { length } = travel()
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    if (length <= 0) return
    const delta = ((e.clientY - drag.current.startY) / length) * scrollable
    window.scrollTo({ top: drag.current.startScroll + delta, behavior: 'instant' })
  }

  const endDrag = () => { drag.current = null }

  if (!pos.visible) return null

  return (
    <div
      ref={knobRef}
      className={`floating-scrollbar${active ? ' is-active' : ''}`}
      style={{ top: pos.top }}
      aria-hidden='true'
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <img src='/scroll/maki-knob.webp' alt='' draggable='false' style={{ transform: `rotate(${pos.roll}deg)` }} />
    </div>
  )
}

export default FloatingScrollbar
