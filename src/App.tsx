import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Link, Outlet } from 'react-router-dom'
import Homepage from './components/HomePage/Homepage'
import Realtalk from './components/RealTalk/Realtalk'

function App() {
  return (
    <>
      <header><Navbar /></header>
      <Outlet />
    </>
  )
}

export default App
