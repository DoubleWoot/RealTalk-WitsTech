import logo_navbar from './rt_logo1.png'
import { Link } from 'react-router-dom';
import './Navbar.css'

export default function navbar() {
  return (
    <header className="navbar">
        <div className="navbar_logo">
            <Link to= "/"><img className="logo" src={logo_navbar} alt='Home Page'/></Link>
        </div>
        <ul className="navlist">
            <li className="aboutus_item"><Link to="/about-us">About Us</Link></li>
            <li className="realtalk_item"><Link to="/realtalk">RealTalk</Link></li>
        </ul>
    </header>
  )
}