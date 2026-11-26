import { CURRENCY_SYMBOL } from '../config'

// "₱1,250" for whole amounts, "₱12.50" otherwise.
export const formatPrice = (amount) => {
  const value = Number(amount) || 0
  const decimals = Number.isInteger(value) ? 0 : 2
  return `${CURRENCY_SYMBOL}${value.toLocaleString('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: 2 })}`
}
