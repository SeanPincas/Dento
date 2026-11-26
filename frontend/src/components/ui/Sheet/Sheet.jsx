import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Sheet.css'

// Panel that slides up from the bottom nav on phones and in from the right on
// tablets. It sits above the page but under the bottom nav, so the tabs stay
// usable. Closes on Escape or a tap on the dimmed page; the page behind it
// does not scroll while it is open.
const Sheet = ({ onClose, label, className = '', children }) => {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const panelRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onCloseRef.current() }
    // Lock the page on <html>, not <body>: <html> clips sideways overflow
    // (index.css), so hiding <body>'s overflow would make <body> its own
    // frozen scroll box and push the sticky navbar out of view.
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    window.addEventListener('keydown', onKeyDown)
    root.style.overflow = 'hidden'
    panelRef.current?.focus({ preventScroll: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      root.style.overflow = previousOverflow
    }
  }, [])

  return createPortal(
    <div className='sheet' onMouseDown={(e) => { if (e.target === e.currentTarget) onCloseRef.current() }}>
      <div ref={panelRef} tabIndex={-1} className={`sheet-panel ${className}`} role='dialog' aria-modal='true' aria-label={label}>
        <span className='sheet-handle' aria-hidden='true' />
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Sheet
