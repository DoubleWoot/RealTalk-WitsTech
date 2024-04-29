import React from 'react'
import logo_navbar from "../assets/rt_logo1.png"
import './Navbar.css'

export default function navbar() {
  return (
    <header className="navbar">
        <div className="navbar_logo">
            <img className="logo" src={logo_navbar} alt='Home Page'/>
        </div>
        <ul  className="navlist">
            <li><a href="#">About Us</a></li>
            <li><a href="#">RealTalk</a></li>
        </ul>
    </header>
  )
}
