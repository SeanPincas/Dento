import axios from 'axios'
import { API_URL } from '../config'

// Every call to the Dento backend lives here, so components never build URLs
// or auth headers themselves. Each function resolves to the response body.

const http = axios.create({ baseURL: API_URL })
const withToken = (token) => ({ headers: { token } })
const body = (request) => request.then((response) => response.data)

export const imageUrl = (fileName) => `${API_URL}/images/${fileName}`

export const api = {
  // Menu
  listFood: () => body(http.get('/api/food/list')),

  // Account
  login: (credentials) => body(http.post('/api/user/login', credentials)),
  register: (details) => body(http.post('/api/user/register', details)),

  // Cart (signed-in users)
  getCart: (token) => body(http.post('/api/cart/get', {}, withToken(token))),
  addToCart: (token, itemId) => body(http.post('/api/cart/add', { itemId }, withToken(token))),
  removeFromCart: (token, itemId) => body(http.post('/api/cart/remove', { itemId }, withToken(token))),
  setCartQuantity: (token, itemId, quantity) =>
    body(http.post('/api/cart/set', { itemId, quantity }, withToken(token))),

  // Orders
  placeOrder: (token, order) => body(http.post('/api/order/place', order, withToken(token))),
  verifyPayment: (success, orderId) => body(http.post('/api/order/verify', { success, orderId })),
  userOrders: (token) => body(http.post('/api/order/userorders', {}, withToken(token))),
}
