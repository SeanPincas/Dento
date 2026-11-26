import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { COMPACT_QUERY } from '../../hooks/useOpenSlip'
import { scrollToSection } from '../../utils/scrollTo'

// The order slip is the cart now. Old /cart links land on the menu with the
// slip showing: as a sheet on phones and tablets, in the sidebar otherwise.
const Cart = () => {
  const { setSlipOpen } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
    if (window.matchMedia(COMPACT_QUERY).matches) setSlipOpen(true)
    else scrollToSection('food-display')
  }, [])

  return null
}

export default Cart
