import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

// Shared pop-up: rendered into <body> (so the sticky navbar can't cover it),
// closes on Escape or a click on the backdrop, and stops the page scrolling
// behind it while open.
const Modal = ({ onClose, label, position = 'top', className = '', children }) => {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onCloseRef.current() }
    // Lock the page on <html>, not <body>: <html> clips sideways overflow
    // (index.css), so hiding <body>'s overflow would make <body> its own
    // frozen scroll box and push the sticky navbar out of view.
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    window.addEventListener('keydown', onKeyDown)
    root.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      root.style.overflow = previousOverflow
    }
  }, [])

  return createPortal(
    <div
      className={`modal modal-${position}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCloseRef.current() }}
    >
      <div className={`modal-panel ${className}`} role='dialog' aria-modal='true' aria-label={label}>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
