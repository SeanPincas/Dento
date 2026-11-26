import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

// Social links. Shown under the brand text, or (phones and tablets) under Get in touch.
const SocialIcons = ({ className }) => (
    <div className={`footer-social-icons ${className}`}>
        <img src={assets.facebook_icon} alt="Facebook" />
        <img src={assets.twitter_icon} alt="Twitter" />
        <img src={assets.linkedin_icon} alt="LinkedIn" />
        <img src={assets.github_icon} alt="GitHub" />
    </div>
)

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="Dento" />
                    <p>Dento is a Japanese food delivery website offering a variety of authentic dishes, including sushi, ramen, and desserts, all prepared with high-quality ingredients and delivered quickly to your door.</p>
                    <SocialIcons className="footer-social-icons-brand" />
                </div>

                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+639-027-8952-581</li>
                        <li>seanpincas28@gmail.com</li>
                    </ul>
                    {/* Phones and tablets show the icons here, under the contact details. */}
                    <SocialIcons className="footer-social-icons-contact" />
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2024 © Dento<span className="footer-copyright-sep"> - </span><br className="footer-copyright-break" />All Rights Reserved.</p>
        </div>
    )
}

export default Footer