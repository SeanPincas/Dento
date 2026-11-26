import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        }
        else {
            cartData[req.body.itemId] += 1 
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"Added to Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error Adding to Cart"})
    }
}

// remove items from user cart
const removeFromCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"Removed from Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error Removing from Cart"})
    }
}

// set an exact quantity for one item (typed into the dish card)
const MAX_ITEM_QUANTITY = 99
const setCartQuantity = async (req,res) => {
    try {
        const { itemId } = req.body
        const quantity = Number(req.body.quantity)
        if (typeof itemId !== "string" || !itemId || !Number.isInteger(quantity) || quantity < 0 || quantity > MAX_ITEM_QUANTITY) {
            return res.json({success:false,message:`Quantity must be a whole number from 0 to ${MAX_ITEM_QUANTITY}`})
        }
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData
        cartData[itemId] = quantity
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"Cart Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error Updating Cart"})
    }
}

// fetch user cart data
const getCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error Fetching Cart Data"})
    }
}

export { addToCart, removeFromCart, setCartQuantity, getCart}