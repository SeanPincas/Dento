import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import OrderTray from '../../components/OrderTray/OrderTray'

const EMPTY_ADDRESS = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  province: '',
  zipcode: '',
  country: '',
  phone: '',
}

// [field, placeholder, input type] in rows; two fields in a row sit side by side.
const ADDRESS_ROWS = [
  [['firstName', 'First Name'], ['lastName', 'Last Name']],
  [['email', 'Email Address', 'email']],
  [['street', 'Street']],
  [['city', 'City'], ['province', 'Province']],
  [['zipcode', 'Zip code'], ['country', 'Country']],
  [['phone', 'Phone Number', 'tel']],
]

const PlaceOrder = () => {

  const { getTotalCartAmount, getOrderTotal, token, food_list, cartItems, setShowLogin } = useContext(StoreContext)
  const [data, setData] = useState(EMPTY_ADDRESS)
  const navigate = useNavigate()

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault()

    const items = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItems[item._id] }))

    try {
      const response = await api.placeOrder(token, { address: data, items, amount: getOrderTotal() })
      if (response.success) {
        window.location.href = response.session_url // Stripe Checkout
      } else {
        alert('Error placing order. Please try again.')
      }
    } catch (error) {
      console.error('Order placement error:', error)
      alert('Error placing order. Please try again.')
    }
  }

  // Checkout needs a signed-in user and something on the slip. The saved
  // sign-in and the menu load after the first render, so wait for them.
  useEffect(() => {
    if (!token && !localStorage.getItem('token')) {
      navigate('/')
      setShowLogin(true)
    } else if (food_list.length > 0 && getTotalCartAmount() === 0) {
      navigate('/')
    }
  }, [token, food_list.length, cartItems])

  const field = ([name, placeholder, type = 'text']) => (
    <input key={name} required name={name} onChange={onChangeHandler} value={data[name]} type={type} placeholder={placeholder} aria-label={placeholder} />
  )

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>
        {ADDRESS_ROWS.map((row) =>
          row.length > 1
            ? <div key={row[0][0]} className='multi-fields'>{row.map(field)}</div>
            : field(row[0])
        )}
      </div>

      <div className='place-order-right'>
        {/* The stamped slip, read-only: what is being paid for. */}
        <OrderTray readOnly />
        <button type='submit' className='place-order-pay'>Proceed to payment</button>
      </div>
    </form>
  )
}

export default PlaceOrder
