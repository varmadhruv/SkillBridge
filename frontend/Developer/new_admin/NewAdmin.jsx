import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './NewAdmin.css';

function NewAdmin() {
  const [formData, setFormData] = useState({
    adminName: '',
    adminUsername: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AdminName: formData.adminName,
          AdminUsername: formData.adminUsername,
          AdminPassword: formData.password,
          AdminEmail: formData.adminEmail
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Admin Created Successfully!");
        setFormData({ adminName: '', adminUsername: '', adminEmail: '', password: '', confirmPassword: '' });
      } else {
        toast.error(data.message || "Failed to create admin");
      }
    } catch (err) {
      toast.error("An error occurred while connecting to the server.");
    }
  };

  const EyeIcon = ({ show, toggle }) => (
    <span className="eye-icon" onClick={toggle}>
      {show ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </span>
  );

  return (
    <div className="new-admin-container">
      <Toaster position="top-right" />
      <div className="admin-card">
        <div className="card-branding">SkillBridge</div>
        <h1 className="card-heading">New Admin</h1>
        
        <form onSubmit={handleCreate} className="admin-form">
          <input 
            type="text" 
            name="adminName"
            placeholder="Admin Name" 
            value={formData.adminName}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="adminUsername"
            placeholder="Admin Username" 
            value={formData.adminUsername}
            onChange={handleChange}
            required 
          />
          <input 
            type="email" 
            name="adminEmail"
            placeholder="Admin Email ID" 
            value={formData.adminEmail}
            onChange={handleChange}
            required 
          />
          <div className="password-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <EyeIcon show={showPassword} toggle={() => setShowPassword(!showPassword)} />
          </div>
          <div className="password-input-container">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword"
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
            <EyeIcon show={showConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} />
          </div>
          
          <button type="submit" className="create-btn">Create</button>
        </form>
      </div>
      <button className="back-btn" onClick={() => window.location.href = '/Developer/dev_home/'}>Back</button>
    </div>
  );
}

export default NewAdmin;
