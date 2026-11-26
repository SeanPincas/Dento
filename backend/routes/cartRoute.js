import express from 'express'
import { addToCart, removeFromCart, setCartQuantity, getCart } from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post("/add",authMiddleware,addToCart)
cartRouter.post("/remove",authMiddleware, removeFromCart)
cartRouter.post("/set",authMiddleware, setCartQuantity)
cartRouter.post("/get",authMiddleware, getCart)

export default cartRouter;
