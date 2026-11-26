import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import './SearchPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { imageUrl } from '../../services/api'
import { formatPrice } from '../../utils/format'
import { MAX_QUERY_LENGTH, sanitizeQuery, toKeywords, matchesDish } from '../../utils/dishSearch'
import Modal from '../ui/Modal/Modal'
import QuantityStepper from '../ui/QuantityStepper/QuantityStepper'

// Dish search pop-up: only dishes on the menu (by name or category) match.
const SearchPopup = ({ setShowSearch, initialQuery = '' }) => {
  const { food_list, cartItems, addToCart } = useContext(StoreContext)
  const [query, setQuery] = useState(() => sanitizeQuery(initialQuery))
  const inputRef = useRef(null)
  const close = () => setShowSearch(false)

  useEffect(() => { inputRef.current?.focus() }, [])

  const keywords = toKeywords(query)
  const results = useMemo(() => {
    if (keywords.length === 0) return []
    return food_list.filter((item) => matchesDish(item, keywords))
  }, [food_list, keywords.join(' ')])

  return (
    <Modal onClose={close} label='Search dishes' position='top' className='search-popup-container'>
      <div className='search-popup-bar'>
        <img src={assets.search_icon} alt='' />
        <input
          ref={inputRef}
          type='text'
          value={query}
          maxLength={MAX_QUERY_LENGTH}
          onChange={(e) => setQuery(sanitizeQuery(e.target.value))}
          placeholder='Search dishes, e.g. sushi, ramen, tempura'
          aria-label='Search dishes'
        />
        <button type='button' className='search-popup-close' aria-label='Close search' onClick={close}>
          <img src={assets.cross_icon} alt='' />
        </button>
      </div>

      <div className='search-popup-results'>
        {keywords.length === 0 ? (
          <p className='search-popup-hint'>Type a dish name or menu category to search our menu.</p>
        ) : results.length === 0 ? (
          <p className='search-popup-hint'>
            No dishes on our menu match "{query.trim()}". Try another dish name.
          </p>
        ) : (
          results.map((item) => (
            <div key={item._id} className='search-popup-item'>
              <img className='search-popup-item-img' src={imageUrl(item.image)} alt='' />
              <div className='search-popup-item-info'>
                <p className='search-popup-item-name'>{item.name}</p>
                <p className='search-popup-item-category'>{item.category}</p>
              </div>
              <p className='search-popup-item-price'>{formatPrice(item.price)}</p>
              {!cartItems?.[item._id] ? (
                <button type='button' className='search-popup-add' aria-label={`Add ${item.name} to order`} onClick={() => addToCart(item._id)}>+</button>
              ) : (
                <QuantityStepper itemId={item._id} itemName={item.name} variant='light' />
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}

export default SearchPopup
