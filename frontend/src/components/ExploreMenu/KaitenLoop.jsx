import React, { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../utils/motion'
import { GLIDE_MS, KaitenArrows, KaitenDish, RESUME_DELAY, SLAT, SPEED, easeInOut } from './KaitenBelt'

// Phones: a two-tier counter with ONE conveyor loop, like a real kaiten bar.
// Plates run right to left along the upper belt, drop to the lower belt just
// past the left edge, run back left to right, and rise to the upper belt just
// past the right edge. The turns happen off screen.
//
// The two counters are drawn empty (one invisible sample plate gives each its
// height); the plates live in one layer on top and are placed every frame.
const KaitenLoop = ({ items, category, onPick }) => {
  const wrapRef = useRef(null)
  const upperBelt = useRef(null)
  const lowerBelt = useRef(null)
  const upperSample = useRef(null)
  const lowerSample = useRef(null)
  const dishRefs = useRef([])
  const state = useRef({ offset: 0, hovered: false, resumeAt: 0, glide: null })
  // Layout: screen width, plate pitch and the top of each lane in the layer.
  const layout = useRef({ width: 0, pitch: 0, dish: 0, upperY: 0, lowerY: 0 })
  const [count, setCount] = useState(items.length)

  // Measure the lanes, and use enough plates to fill the loop with even gaps.
  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current
      const sampleU = upperSample.current
      const sampleL = lowerSample.current
      if (!wrap || !sampleU || !sampleL) return
      const wrapTop = wrap.getBoundingClientRect().top
      const dish = sampleU.offsetWidth
      const gap = parseFloat(getComputedStyle(sampleU).marginRight || 0)
      const width = wrap.clientWidth
      const loop = 2 * (width + dish + gap)
      layout.current = {
        width,
        dish,
        pitch: dish + gap,
        upperY: sampleU.getBoundingClientRect().top - wrapTop,
        lowerY: sampleL.getBoundingClientRect().top - wrapTop,
      }
      setCount(Math.max(items.length, Math.ceil(loop / (dish + gap))))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrapRef.current)
    return () => observer.disconnect()
  }, [items.length])

  useEffect(() => {
    const s = state.current
    const reduceMotion = prefersReducedMotion()
    let frame
    let last = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (s.glide) {
        const t = Math.min((now - s.glide.start) / GLIDE_MS, 1)
        s.offset = s.glide.from + (s.glide.to - s.glide.from) * easeInOut(t)
        if (t === 1) s.glide = null
      } else if (!reduceMotion && !s.hovered && now >= s.resumeAt) {
        s.offset += SPEED * dt
      }

      const { width, dish, pitch, upperY, lowerY } = layout.current
      if (width > 0) {
        // One lane runs from just off the right edge to just off the left.
        const lane = width + pitch
        const loop = 2 * lane
        const spacing = loop / count
        dishRefs.current.forEach((el, i) => {
          if (!el) return
          const along = (((s.offset + i * spacing) % loop) + loop) % loop
          const onUpper = along < lane
          const x = onUpper ? width - along : -pitch + (along - lane)
          el.style.transform = `translate(${x}px, ${onUpper ? upperY : lowerY}px)`
          el.style.visibility = x > -dish - 1 && x < width + 1 ? 'visible' : 'hidden'
        })
        const slat = ((s.offset % SLAT) + SLAT) % SLAT
        if (upperBelt.current) upperBelt.current.style.backgroundPositionX = `${-slat}px`
        if (lowerBelt.current) lowerBelt.current.style.backgroundPositionX = `${slat}px`
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [count])

  // Glide one screen of plates along the loop, then wait 3s before running on.
  const slide = (step) => {
    const s = state.current
    const { width, pitch } = layout.current
    if (!pitch) return
    const distance = Math.max(1, Math.floor(width / pitch)) * pitch
    const from = s.offset
    const to = (s.glide ? s.glide.to : from) + step * distance
    const start = performance.now()
    s.glide = { from, to, start }
    s.resumeAt = start + GLIDE_MS + RESUME_DELAY
  }

  const hold = (value) => { state.current.hovered = value }

  // An empty counter: belt, wood and an invisible plate for height.
  const counter = (beltRef, sampleRef, className = '') => (
    <div className={`kaiten-bar ${className}`} aria-hidden='true'>
      <div className='kaiten-belt'>
        <div className='kaiten-belt-surface' ref={beltRef} />
      </div>
      <div className='kaiten-window'>
        <div className='kaiten-track'>
          <div className='kaiten-dish kaiten-dish-sample' ref={sampleRef}>
            <span className='ceramic-plate kaiten-plate' />
            <span className='kaiten-tag'>
              <span className='kaiten-tag-jp'>あ</span>
              <span className='kaiten-tag-name'>A</span>
            </span>
          </div>
        </div>
      </div>
      <div className='kaiten-counter' />
    </div>
  )

  return (
    <div className='kaiten-loop' ref={wrapRef}>
      {counter(upperBelt, upperSample)}
      {/* Shared arrows, centred on the stones between the two counters. */}
      <div className='kaiten-mid-controls'>
        <KaitenArrows onSlide={slide} />
      </div>
      {/* Cobblestone walkway between the two counters. */}
      <div className='explore-menu-floor explore-menu-floor-mid' aria-hidden='true' />
      {counter(lowerBelt, lowerSample, 'kaiten-bar-lower')}

      <div
        className='kaiten-loop-plates'
        role='group'
        aria-label='Categories'
        onMouseEnter={() => hold(true)}
        onMouseLeave={() => hold(false)}
        onFocus={() => hold(true)}
        onBlur={() => hold(false)}
      >
        {Array.from({ length: count }, (_, i) => {
          const item = items[i % items.length]
          return (
            <KaitenDish
              key={i}
              dishRef={(el) => { dishRefs.current[i] = el }}
              item={item}
              active={category === item.menu_name}
              hidden={i >= items.length}
              onPick={onPick}
            />
          )
        })}
      </div>
    </div>
  )
}

export default KaitenLoop
