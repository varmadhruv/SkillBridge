import React from 'react';
import './Navbar.css';


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
function Navbar() {
  return (
    <nav className="dashboard-nav">
      <div className="nav-brand">Admin Panel</div>
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#my-account">My Account</a>
        <a href="#rules">Rules</a>
        <a href="#contact-dev">Contact Dev</a>
        <a href="#judge">Judge</a>
        <a href="#help">Help</a>
      </div>
    </nav>
  );
}

export default Navbar;
