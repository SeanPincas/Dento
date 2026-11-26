import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './BottomNav.css'
import { StoreContext } from '../../context/StoreContext'
import { scrollToSection, scrollToTop } from '../../utils/scrollTo'
import Sheet from '../ui/Sheet/Sheet'
import { BowlIcon, HomeIcon, LogoutIcon, MailIcon, PhoneIcon, SearchIcon, SlipIcon, UserIcon } from '../ui/Icons/Icons'

// Which part of the home page is on screen: the hero ("home") or the menu.
function useHomeSection(pathname) {
  const [section, setSection] = useState('home')
  useEffect(() => {
    if (pathname !== '/') return
    const update = () => {
      const menu = document.getElementById('explore-menu')
      setSection(menu && menu.getBoundingClientRect().top < window.innerHeight / 2 ? 'menu' : 'home')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [pathname])
  return section
}

// Phone and tablet navigation: Home, Menu, the raised Order (伝票) button with
// the plate count, Search and Account. Shown at 1050px and below.
const BottomNav = () => {
  const { token, signOut, slipOpen, setSlipOpen, setShowLogin, setShowSearch, getCartCount } = useContext(StoreContext)
  const [accountOpen, setAccountOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const section = useHomeSection(pathname)
  const count = getCartCount()

  const closeAll = () => {
    setSlipOpen(false)
    setAccountOpen(false)
  }

  // Go to a section of the home page, from any page.
  const goTo = (id) => {
    closeAll()
    if (pathname !== '/') navigate('/')
    if (id) scrollToSection(id)
    else scrollToTop()
  }

  const toggleOrder = () => {
    setAccountOpen(false)
    setSlipOpen((open) => !open)
  }

  const openSearch = () => {
    closeAll()
    setShowSearch(true)
  }

  const toggleAccount = () => {
    setSlipOpen(false)
    if (!token) {
      setAccountOpen(false)
      setShowLogin(true)
      return
    }
    setAccountOpen((open) => !open)
  }

  const active = accountOpen ? 'account'
    : slipOpen ? 'order'
    : pathname === '/' ? section
    : null

  const tab = (id, label, Icon, onClick, ariaLabel) => (
    <button
      type='button'
      className={`bottom-nav-tab${active === id ? ' is-active' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={active === id ? 'page' : undefined}
    >
      <Icon size={22} />
      <span>{label}</span>
    </button>
  )

  return (
    <>
      <nav className='bottom-nav' aria-label='Main'>
        {tab('home', 'Home', HomeIcon, () => goTo(null))}
        {tab('menu', 'Menu', BowlIcon, () => goTo('explore-menu'))}

        <button
          type='button'
          className={`bottom-nav-order${active === 'order' ? ' is-active' : ''}`}
          onClick={toggleOrder}
          aria-expanded={slipOpen}
          aria-label={`Order slip, ${count} ${count === 1 ? 'item' : 'items'}`}
        >
          <span className='bottom-nav-order-btn'>
            <SlipIcon size={26} color='#fff' />
            {count > 0 && <span className='bottom-nav-badge' aria-hidden='true'>{count > 99 ? '99+' : count}</span>}
          </span>
          <span className='bottom-nav-order-label'>Order</span>
        </button>

        {tab('search', 'Search', SearchIcon, openSearch, 'Search dishes')}
        {tab('account', token ? 'Account' : 'Sign in', UserIcon, toggleAccount)}
      </nav>

      {accountOpen && (
        <Sheet label='Account' className='account-sheet' onClose={() => setAccountOpen(false)}>
          <div className='account-sheet-head'>
            <span className='account-sheet-mark' aria-hidden='true'>会</span>
            <span>
              <b>Account</b>
              <small>Signed in</small>
            </span>
          </div>
          <ul className='account-sheet-list'>
            <li><button type='button' onClick={() => { closeAll(); navigate('/orders') }}><SlipIcon size={20} /><span>My orders</span><i aria-hidden='true'>›</i></button></li>
            <li><button type='button' onClick={() => goTo('app-download')}><PhoneIcon size={20} /><span>Mobile app</span><i aria-hidden='true'>›</i></button></li>
            <li><button type='button' onClick={() => { closeAll(); scrollToSection('footer') }}><MailIcon size={20} /><span>Contact us</span><i aria-hidden='true'>›</i></button></li>
            <li><button type='button' onClick={() => { closeAll(); signOut(); navigate('/') }}><LogoutIcon size={20} /><span>Log out</span></button></li>
          </ul>
        </Sheet>
      )}
    </>
  )
}

export default BottomNav
