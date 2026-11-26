import React, { useContext, useEffect, useState } from 'react'
import './FoodItem.css'
import { StoreContext } from '../../context/StoreContext'
import { CATEGORY_JP } from '../../utils/dishSearch'
import { imageUrl } from '../../services/api'
import { formatPrice } from '../../utils/format'
import QuantityStepper from '../ui/QuantityStepper/QuantityStepper'
import { StarIcon } from '../ui/Icons/Icons'

// Full-image dish card (design 5b): Japanese name top-left, price top-right,
// and a frosted glass panel that expands to show the description and a
// quantity you can type.
// Temporarily off: hide the round count while a dish isn't in the order.
const SHOW_ZERO_COUNT = false

const FoodItem = ({ id, name, price, description, image, category, rating = 4, located = false }) => {

  const { cartItems } = useContext(StoreContext)
  const qty = cartItems?.[id] ?? 0
  const [pinned, setPinned] = useState(false)

  // Opened from the order slip: hold the panel open while highlighted so
  // quantities can be changed here; it closes again afterwards (hover still opens it).
  useEffect(() => { setPinned(located) }, [located])

  const ratingLabel = `${Number(rating).toFixed(rating % 1 ? 1 : 0)}/5`

  return (
    <article id={`dish-${id}`} className={`food-item${pinned ? ' open' : ''}${located ? ' is-located' : ''}`}>
      <img className='food-item-image' src={imageUrl(image)} alt={name} />
      <span className='food-item-jp' aria-hidden='true'>{CATEGORY_JP[category] ?? ''}</span>
      <span className='food-item-price'>{formatPrice(price)}</span>

      <div className='food-item-panel'>
        {/* One row: category + name stacked, then rating and the add/count button. */}
        <div className='food-item-row'>
          <div className='food-item-title'>
            <span className='food-item-category'>{category}</span>
            <h3>{name}</h3>
          </div>
          <span className='food-item-rating' aria-label={`Rated ${ratingLabel}`}>
            <StarIcon size={13} />
            {ratingLabel}
          </span>
          {/* Order count, shown once the dish is ordered. Tapping it opens the
              panel on touch screens. To show "0" again for unordered dishes,
              set SHOW_ZERO_COUNT to true (styled by .is-empty). */}
          {(qty > 0 || SHOW_ZERO_COUNT) && <button
            type='button'
            className={`food-item-count${qty === 0 ? ' is-empty' : ''}`}
            aria-label={`${qty} ${name} in your order. Show quantity`}
            aria-expanded={pinned}
            onClick={() => setPinned((p) => !p)}
          >
            {qty}
          </button>}
        </div>

        {/* Expands on hover or focus, or when the order count is tapped (touch screens). */}
        <div className='food-item-more'>
          <p className='food-item-desc'>{description}</p>
          <div className='food-item-qty'>
            <label htmlFor={`qty-${id}`}>Quantity</label>
            <QuantityStepper itemId={id} itemName={name} inputId={`qty-${id}`} variant='glass' />
          </div>
        </div>
      </div>
    </article>
  )
}

export default FoodItem
