import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets.js'

const Navbar = () => {
  return (
    <div>
      <div className="navbar">
        <div className="logo-container">
          <img src={assets.logo} alt="" className="logo" />
          <p className="admin-label">ADMIN PANEL</p>
        </div>
        <img src={assets.profile_image} alt="" className="profile" />
      </div>
    </div>
  )
}

export default Navbar
