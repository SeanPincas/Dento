// App-wide settings. Keep DELIVERY_FEE and CURRENCY in step with the backend
// (backend/controllers/orderController.js charges in PHP with a ₱25 fee).

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export const CURRENCY_SYMBOL = '₱'
export const DELIVERY_FEE = 25
export const MAX_ITEM_QUANTITY = 99
