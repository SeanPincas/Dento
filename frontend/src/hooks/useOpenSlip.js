import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'
import { scrollToSection } from '../utils/scrollTo'

// Widest screen that uses the bottom nav and the slip sheet; must match the
// 1050px breakpoints in the CSS.
export const COMPACT_QUERY = '(max-width: 1050px)'

// Show the order slip. On wide screens it lives in the menu's sidebar, so go
// there; on phones and tablets open it as a sheet.
export function useOpenSlip() {
  const { setSlipOpen } = useContext(StoreContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return () => {
    if (window.matchMedia(COMPACT_QUERY).matches) {
      setSlipOpen(true)
      return
    }
    if (pathname !== '/') navigate('/')
    scrollToSection('food-display')
  }
}
