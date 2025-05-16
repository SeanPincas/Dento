import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order for frontend
const placeOrder = async (req, res) => {
    // variable for frontend url
    const frontend_url = "http://localhost:5173"
    // creating new order
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        // saving order to the database
        await newOrder.save()
        //cleaning user cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} })
        // creating line item for payment
        const line_items = req.body.items.map(() => ({
            price_data: {
                currency: "php",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 55.58
            },
            quantity: item.quantity
        }))
        // delivery charges
        line_items.push({
            price_data: {
                currency: "php",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 55.58
            },
            quantity: 1
        })
        // session process
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })
        res.json({ sucess: true, session_url: session.url })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error Payment Session" })
    }
}

export { placeOrder }




