import React from 'react';
import './DevHome.css';

function DevHome() {
  return (
    <div className="dev-home-container">
      <div className="dashboard-card">
        <div className="card-branding">SkillBridge</div>
        <h1 className="dashboard-title">Developer Dashboard</h1>
        <p className="dashboard-subtitle">All the power is in your hands</p>
        
        <div className="button-group">
          <button className="nav-btn" onClick={() => window.location.href = '/Developer/Explore_admin/'}>
            Explore Admin
          </button>
          <button className="nav-btn" onClick={() => window.location.href = '/Developer/new_admin/'}>
            Create New Admin
          </button>
        </div>

        <div className="card-back-btn-container">
          <button className="card-back-btn" onClick={() => window.location.href = '/Dive_in/index.html'}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default DevHome;
