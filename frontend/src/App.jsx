import React, { useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import Orders from './pages/Orders/Orders'
import FloatingScrollbar from './components/ui/FloatingScrollbar/FloatingScrollbar'
import BottomNav from './components/BottomNav/BottomNav'
import OrderSheet from './components/OrderSheet/OrderSheet'
import SearchPopup from './components/SearchPopup/SearchPopup'
import { StoreContext } from './context/StoreContext'

const App = () => {

  const { showLogin, setShowLogin, showSearch, setShowSearch } = useContext(StoreContext)

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {showSearch && <SearchPopup setShowSearch={setShowSearch} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          < Route path='/' element={<Home />} />
          {/* The order slip is the cart; /cart only redirects to it. */}
          < Route path='/cart' element={<Cart />} />
          < Route path='/order' element={<PlaceOrder />} />
          < Route path='/verify' element={<Verify />} />
          < Route path='/orders' element={<Orders />} />
        </Routes>
      </div>
      <Footer />
      <FloatingScrollbar />
      <OrderSheet />
      <BottomNav />
    </>
  )
}

export default App