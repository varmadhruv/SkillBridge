import React, { useState, useEffect } from 'react';
import './Myaccount.css';

function Myaccount() {
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const storedName = localStorage.getItem('AdminName');
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  return (
    <div className="myaccount-wrapper">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="status-indicator"></div>
            </div>
            <div className="profile-info">
              <h1 className="admin-name">{adminName}</h1>
              <span className="role-badge">System Administrator</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">Active</span>
              <span className="stat-label">Status</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">Admin</span>
              <span className="stat-label">Access Level</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">Verified</span>
              <span className="stat-label">Security</span>
            </div>
          </div>

          <div className="quote-section">
            <div className="quote-icon">"</div>
            <p className="main-quote">
              The power to bridge the gap between knowledge and skill is in your hands.
            </p>
            <p className="sub-quote">
              Great leaders don't just build systems; they build the people who use them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myaccount;
