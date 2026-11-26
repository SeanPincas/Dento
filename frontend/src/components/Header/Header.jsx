import React, { useState } from 'react'
import './Header.css'
import SearchPopup from '../SearchPopup/SearchPopup'
import { SearchIcon } from '../ui/Icons/Icons'

const HERO_CATEGORIES = ['Sushi', 'Rolls', 'Noodles', 'Onigiri', 'Desserts']

const Header = ({ setCategory }) => {
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const openSearch = (e) => {
    e.preventDefault()
    setShowSearch(true)
  }

  const pickCategory = (name) => {
    setCategory?.(name)
    document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' })
  }

  const closeSearch = (value) => {
    setShowSearch(value)
    if (!value) setQuery('')
  }

  return (
    <section className='header'>
      {showSearch && <SearchPopup setShowSearch={closeSearch} initialQuery={query} />}

      <div className='header-noren' aria-hidden='true'>
        <span className='header-noren-panel'>伝</span>
        <span className='header-noren-panel header-noren-panel-light'>統</span>
      </div>

      <div className='header-contents'>
        <span className='header-eyebrow'>Itadakimasu · いただきます</span>
        <h1>Your Japanese cravings,<br />delivered tonight.</h1>
        <p>Find a dish from our menu and we will bring it to your door, fresh from the kitchen.</p>

        <form className='header-search' onSubmit={openSearch} role='search'>
          <SearchIcon size={22} color='#ad7230' />
          <label htmlFor='header-search-input' className='visually-hidden'>Search dishes</label>
          <input
            id='header-search-input'
            type='text'
            value={query}
            maxLength={40}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search sushi, rolls, onigiri…'
          />
          <button type='submit'>Search</button>
        </form>

        <div className='header-chips'>
          {HERO_CATEGORIES.map((name) => (
            <button key={name} type='button' onClick={() => pickCategory(name)}>{name}</button>
          ))}
          <a href='#explore-menu' className='header-chip-primary'>View full menu →</a>
        </div>
      </div>
    </section>
  )
}

export default Header
