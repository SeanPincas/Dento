import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order for frontend
const placeOrder = async (req, res) => {
    // variable for frontend url
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173"
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
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "php",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
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
                unit_amount: 25 * 100
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
        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error Payment Session" })
    }
}

const verifyOrder = async (req,res) => {
    const {orderId, success} = req.body
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true,message:"Paid"})
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false, message:"Not Paid"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Verify Order: False"})
    }
}

// user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Error Order"})
    }
}

export { placeOrder, verifyOrder, userOrders }




