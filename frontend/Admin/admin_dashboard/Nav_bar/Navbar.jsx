import React from 'react';
import './Navbar.css';

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
