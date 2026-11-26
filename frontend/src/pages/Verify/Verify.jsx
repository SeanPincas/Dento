import React, { useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'

// Landing page after Stripe Checkout: confirms the payment, then moves on.
const Verify = () => {

    const [searchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const navigate = useNavigate()

    useEffect(() => {
        api.verifyPayment(success, orderId).then((response) => {
            navigate(response.success ? '/orders' : '/') // paid: show the order
        })
    }, [])

    return (
        <div className='verify'>
            <div className='spinner'></div>
        </div>
    )
}

export default Verify
