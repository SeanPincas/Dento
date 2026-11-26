import React, { useContext, useEffect, useState } from 'react'
import './QuantityStepper.css'
import { StoreContext } from '../../../context/StoreContext'
import { MAX_ITEM_QUANTITY } from '../../../config'

// − [qty] + control wired to the cart. With `editable`, the number can be
// typed (digits only, saved on blur or Enter). Variants: 'glass' (on dark
// glass panels) and 'light' (on white backgrounds).
const QuantityStepper = ({ itemId, itemName, inputId, variant = 'light', editable = true }) => {
  const { cartItems, addToCart, removeFromCart, setItemQuantity } = useContext(StoreContext)
  const qty = cartItems?.[itemId] ?? 0
  const [draft, setDraft] = useState(String(qty))

  // Keep the typed box in step when the quantity changes elsewhere.
  useEffect(() => { setDraft(String(qty)) }, [qty])

  const commit = () => {
    const next = Math.min(MAX_ITEM_QUANTITY, parseInt(draft || '0', 10))
    if (next !== qty) setItemQuantity(itemId, next)
    else setDraft(String(qty))
  }

  const maxDigits = String(MAX_ITEM_QUANTITY).length

  return (
    <div className={`qty-stepper qty-stepper-${variant}`}>
      <button type='button' aria-label={`Remove one ${itemName}`} onClick={() => removeFromCart(itemId)} disabled={qty === 0}>−</button>
      {editable ? (
        <input
          id={inputId}
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          maxLength={maxDigits}
          aria-label={inputId ? undefined : `Quantity of ${itemName}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, maxDigits))}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
        />
      ) : (
        <span className='qty-stepper-value' aria-live='polite'>{qty}</span>
      )}
      <button type='button' aria-label={`Add one ${itemName}`} onClick={() => addToCart(itemId)} disabled={qty >= MAX_ITEM_QUANTITY}>+</button>
    </div>
  )
}

export default QuantityStepper
