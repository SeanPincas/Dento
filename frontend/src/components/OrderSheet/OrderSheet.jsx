import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './OrderSheet.css'
import { StoreContext } from '../../context/StoreContext'
import { COMPACT_QUERY } from '../../hooks/useOpenSlip'
import Sheet from '../ui/Sheet/Sheet'
import OrderTray from '../OrderTray/OrderTray'

// The order slip as a sheet on phones and tablets (the Order tab). It is the
// cart: tapping a line closes the sheet and finds that dish in the menu.
const OrderSheet = () => {
  const { slipOpen, setSlipOpen, requestLocate } = useContext(StoreContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Wide screens show the slip in the menu sidebar instead.
  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY)
    const onChange = () => { if (!query.matches) setSlipOpen(false) }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  if (!slipOpen) return null

  const locate = (itemId) => {
    setSlipOpen(false)
    if (pathname !== '/') navigate('/')
    requestLocate(itemId)
  }

  return (
    <Sheet label='Your order' className='order-sheet' onClose={() => setSlipOpen(false)}>
      <OrderTray onLocate={locate} />
    </Sheet>
  )
}

export default OrderSheet
