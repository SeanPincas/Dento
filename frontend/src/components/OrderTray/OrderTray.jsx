import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrderTray.css'
import { StoreContext } from '../../context/StoreContext'
import { imageUrl } from '../../services/api'
import { formatPrice } from '../../utils/format'
import { prefersReducedMotion } from '../../utils/motion'

const STAMP_MS = 900 // stamp lands, holds briefly, then on to delivery

// The order as a Japanese order slip (伝票). This is the cart: each line jumps
// to that dish's card in the menu (where quantities are changed), and
// Checkout stamps the slip with a red 伝統 seal before going to the delivery
// page. readOnly shows the same slip without links or Checkout (the delivery
// page's order summary).
const OrderTray = ({ onLocate, readOnly = false }) => {
  const { food_list, cartItems, getTotalCartAmount, getDeliveryFee, getOrderTotal, token, setSlipOpen, setShowLogin } = useContext(StoreContext)
  const navigate = useNavigate()
  const [stamping, setStamping] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const ordered = food_list.filter((item) => cartItems?.[item._id] > 0)
  const itemCount = ordered.reduce((n, item) => n + cartItems[item._id], 0)

  const toDelivery = () => {
    setStamping(false)
    setSlipOpen(false)
    navigate('/order')
  }

  const checkout = () => {
    if (stamping) return
    // Ordering needs an account: sign in first, then Checkout again.
    if (!token) {
      setSlipOpen(false)
      setShowLogin(true)
      return
    }
    if (prefersReducedMotion()) {
      toDelivery()
      return
    }
    setStamping(true)
    timer.current = setTimeout(toDelivery, STAMP_MS)
  }

  const lineContent = (item, index) => (
    <>
      <span className='order-slip-no'>{String(index + 1).padStart(2, '0')}</span>
      <img className='order-slip-thumb' src={imageUrl(item.image)} alt='' />
      <span className='order-slip-name'>{item.name}</span>
      <span className='order-slip-qty'>×{cartItems[item._id]}</span>
      <span className='order-slip-dots' aria-hidden='true' />
      <span className='order-slip-price'>{formatPrice(item.price * cartItems[item._id])}</span>
    </>
  )

  return (
    <section className='order-slip-wrap' aria-label='Your order'>
      <div className={`order-slip${stamping ? ' is-stamped' : ''}`}>
        <header className='order-slip-head'>
          <span className='order-slip-title'>伝票</span>
          <span className='order-slip-sub'>Order slip · {itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        </header>

        <div className='order-slip-rule' />

        {ordered.length === 0 ? (
          <p className='order-slip-empty'>No dishes yet. Add one from the menu to start your order.</p>
        ) : (
          <>
            <ol className='order-slip-list'>
              {ordered.map((item, index) => (
                <li key={item._id}>
                  {readOnly ? (
                    <span className='order-slip-line is-static'>{lineContent(item, index)}</span>
                  ) : (
                    <button
                      type='button'
                      className='order-slip-line'
                      onClick={() => onLocate?.(item._id)}
                      aria-label={`${item.name}, ${cartItems[item._id]} ordered, ${formatPrice(item.price * cartItems[item._id])}. Show in menu`}
                    >
                      {lineContent(item, index)}
                    </button>
                  )}
                </li>
              ))}
            </ol>

            <div className='order-slip-rule' />

            <dl className='order-slip-totals'>
              <div><dt>Subtotal</dt><dd>{formatPrice(getTotalCartAmount())}</dd></div>
              <div><dt>Delivery</dt><dd>{formatPrice(getDeliveryFee())}</dd></div>
              <div className='order-slip-total'><dt>Total</dt><dd>{formatPrice(getOrderTotal())}</dd></div>
            </dl>

            {!readOnly && (
              <button type='button' className='order-slip-checkout' onClick={checkout} disabled={stamping}>
                {stamping ? 'Order stamped…' : `Checkout · ${formatPrice(getOrderTotal())}`}
              </button>
            )}
          </>
        )}

        {/* The seal, stamped across the middle of the slip on checkout. */}
        {stamping && (
          <span className='order-slip-stamp' aria-hidden='true'>
            <span className='order-slip-stamp-kanji'>伝統</span>
            <span className='order-slip-stamp-latin'>Dento</span>
          </span>
        )}
      </div>
    </section>
  )
}

export default OrderTray
