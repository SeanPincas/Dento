import React, { useContext, useEffect, useState } from 'react'
import './Orders.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'
import { api } from '../../services/api'
import { formatPrice } from '../../utils/format'

const Orders = () => {

    const { token } = useContext(StoreContext)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        if (!token) return
        api.userOrders(token).then((response) => setOrders(response.data ?? []))
    }, [token])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className='container'>
                {orders.map((order) => (
                    <div key={order._id} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt='' />
                        <p>{order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}</p>
                        <p>{formatPrice(order.amount)}</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button type='button'>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders
