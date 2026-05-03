import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './ExploreAdmin.css';

function ExploreAdmin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get-admins');
      const result = await response.json();
      if (response.ok) {
        setAdmins(result.data);
      } else {
        toast.error(result.message || "Failed to fetch admins");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (adminId) => {
    if (!window.confirm("Are you sure you want to log out this admin? This will delete the record.")) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/delete-admin/${adminId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Admin logged out successfully");
        fetchAdmins(); // Refresh the list
      } else {
        toast.error(result.message || "Failed to log out admin");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  return (
    <div className="explore-container">
      <Toaster position="top-right" />
      <header className="explore-header">
        <h1 className="header-title">Our Admins</h1>
      </header>
      
      <div className="admins-list">
        {loading ? (
          <div className="loading-state">Loading admins...</div>
        ) : admins.length > 0 ? (
          admins.map((admin) => (
            <div key={admin._id} className="admin-info-card">
              <div className="card-item">
                <span className="item-label">Name:</span>
                <span className="item-value">{admin.AdminName}</span>
              </div>
              <div className="card-item">
                <span className="item-label">Username:</span>
                <span className="item-value">{admin.AdminUsername}</span>
              </div>
              <button 
                className="logout-btn" 
                onClick={() => handleLogout(admin._id)}
              >
                LogOut
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">No admin records found.</div>
        )}
      </div>
      <button className="back-btn" onClick={() => window.location.href = '/Developer/dev_home/'}>Back</button>
    </div>
  );
}

export default ExploreAdmin;
