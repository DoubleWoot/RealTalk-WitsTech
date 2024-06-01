import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <header><Navbar /></header>
      <Outlet />
    </>
  )
}

export default App
