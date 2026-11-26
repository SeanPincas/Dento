import { useEffect, useState } from 'react'

// Tracks the navbar's scroll state on the current page:
// - scrolled: the page has moved from the very top
// - overHero: on the home page, the bottom of the hero (.header) is still
//   below the navbar, so the navbar should stay see-through
export const useNavbarScroll = (pathname, navRef) => {
  const [scrolled, setScrolled] = useState(false)
  const [overHero, setOverHero] = useState(pathname === '/')

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 0)
      const hero = pathname === '/' ? document.querySelector('.header') : null
      const navHeight = navRef.current?.offsetHeight ?? 68
      setOverHero(!!hero && hero.getBoundingClientRect().bottom > navHeight)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname, navRef])

  return { scrolled, overHero }
}
