import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <img src={assets.newlogo} alt="Logo" className="brand-logo" />
        <h2>Restaurant Panel</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to='add' className="sidebar-option">
          <div className="option-icon">
            <img src={assets.add_icon} alt="Add" />
          </div>
          <div className="option-content">
            <span className="option-title">Add Items</span>
            <span className="option-description">Add new food items</span>
          </div>
          <div className="option-arrow">→</div>
        </NavLink>
        
        <NavLink to='list' className="sidebar-option">
          <div className="option-icon">
            <img src={assets.order_icon} alt="List" />
          </div>
          <div className="option-content">
            <span className="option-title">List Items</span>
            <span className="option-description">Manage food items</span>
          </div>
          <div className="option-arrow">→</div>
        </NavLink>
        
        <NavLink to='orders' className="sidebar-option">
          <div className="option-icon">
            <img src={assets.order_icon} alt="Orders" />
          </div>
          <div className="option-content">
            <span className="option-title">Orders</span>
            <span className="option-description">Manage orders</span>
          </div>
          <div className="option-arrow">→</div>
        </NavLink>
        
        <NavLink to='profile' className="sidebar-option">
          <div className="option-icon">
            <img src={assets.profile_image} alt="Profile" />
          </div>
          <div className="option-content">
            <span className="option-title">Profile</span>
            <span className="option-description">Restaurant profile</span>
          </div>
          <div className="option-arrow">→</div>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="footer-info">
          <p>Restaurant Management System</p>
          <span className="version">v2.0</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
