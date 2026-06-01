import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar(){
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="brand">Inventory</div>
        <div className="links">
          <NavLink to="/dashboard" className={({isActive})=> isActive? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/products" className={({isActive})=> isActive? 'active' : ''}>Products</NavLink>
          <NavLink to="/customers" className={({isActive})=> isActive? 'active' : ''}>Customers</NavLink>
          <NavLink to="/orders" className={({isActive})=> isActive? 'active' : ''}>Orders</NavLink>
        </div>
      </div>
    </nav>
  )
}
