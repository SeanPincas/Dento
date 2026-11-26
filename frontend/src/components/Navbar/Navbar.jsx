import React, { useContext, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { useNavbarScroll } from '../../hooks/useNavbarScroll'
import { useOpenSlip } from '../../hooks/useOpenSlip'

const NAV_LINKS = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'menu', label: 'Menu', href: '#explore-menu' },
  { id: 'mobile-app', label: 'Mobile App', href: '#app-download' },
  { id: 'contact-us', label: 'Contact Us', href: '#footer' },
]

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState('home')
  const { getCartCount, token, signOut, setShowSearch } = useContext(StoreContext)
  const openSlip = useOpenSlip()
  const count = getCartCount()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const navRef = useRef(null)
  const { scrolled, overHero } = useNavbarScroll(pathname, navRef)

  // See-through over the hero, frosted glass while scrolling inside it,
  // solid (with shadow) everywhere else.
  const navbarClass = [
    'navbar',
    overHero && 'navbar-overlay',
    overHero && scrolled && 'navbar-glass',
    !overHero && scrolled && 'navbar-scrolled',
  ].filter(Boolean).join(' ')

  const logout = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className={navbarClass} ref={navRef}>
      <Link to='/' className='navbar-logo-link'><img src={assets.logo} alt='Dento home' className='logo' /></Link>
      <ul className='navbar-menu'>
        {NAV_LINKS.map(({ id, label, to, href }) => {
          const props = { onClick: () => setMenu(id), className: menu === id ? 'active' : '' }
          return to
            ? <Link key={id} to={to} {...props}>{label}</Link>
            : <a key={id} href={href} {...props}>{label}</a>
        })}
      </ul>
      <div className='navbar-right'>
        <button type='button' className='navbar-icon-btn' aria-label='Search dishes' onClick={() => setShowSearch(true)}>
          <img src={assets.search_icon} alt='' className='navbar-search-btn' />
        </button>
        {/* The basket opens the order slip (the slip is the cart). */}
        <div className='navbar-search-icon'>
          <button type='button' className='navbar-icon-btn' aria-label={`Order slip, ${count} ${count === 1 ? 'item' : 'items'}`} onClick={openSlip}>
            <img src={assets.basket_icon} alt='' />
          </button>
          <div className={count === 0 ? '' : 'dot'}></div>
        </div>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt='Account' />
            <ul className='navbar-profile-dropdown'>
              <li onClick={() => navigate('/orders')}><img src={assets.bag_icon} alt='' />Orders</li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt='' />Logout</li>
            </ul>
          </div>}
      </div>
    </div>
  )
}

export default Navbar
