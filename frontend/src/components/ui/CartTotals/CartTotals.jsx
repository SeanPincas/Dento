import React, { useContext } from 'react'
import './CartTotals.css'
import { StoreContext } from '../../../context/StoreContext'
import { formatPrice } from '../../../utils/format'

// Subtotal, delivery fee and total for the current cart, with one action
// button (e.g. "Proceed to checkout" or a submit button for payment).
const CartTotals = ({ title, actionLabel, onAction, actionType = 'button' }) => {
  const { getTotalCartAmount, getDeliveryFee, getOrderTotal } = useContext(StoreContext)

  return (
    <div className='cart-total'>
      {title && <h2>{title}</h2>}
      <div>
        <div className='cart-total-details'>
          <p>Subtotal</p>
          <p>{formatPrice(getTotalCartAmount())}</p>
        </div>
        <hr />
        <div className='cart-total-details'>
          <p>Delivery Fee</p>
          <p>{formatPrice(getDeliveryFee())}</p>
        </div>
        <hr />
        <div className='cart-total-details'>
          <b>Total</b>
          <b>{formatPrice(getOrderTotal())}</b>
        </div>
      </div>
      <button type={actionType} onClick={onAction}>{actionLabel}</button>
    </div>
  )
}

export default CartTotals
