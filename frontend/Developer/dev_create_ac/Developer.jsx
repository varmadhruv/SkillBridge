import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './Developer.css';

function Developer() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityKey: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecurityKey, setShowSecurityKey] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      securityKey: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/developer-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          securityKey: formData.securityKey
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Developer Account Created Successfully!");
        handleReset();
        window.location.href = '/Developer/Login/';
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      toast.error('An error occurred while connecting to the server.');
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
    <div className="developer-container">
      <Toaster position="top-right" />
      <div className="brand-text">SkillBridge</div>
      <div className="welcome-text">Create Developer Account</div>
      
      <form onSubmit={handleSubmit} className="developer-form">
        <input 
          type="text" 
          name="fullName"
          placeholder="FullName" 
          value={formData.fullName}
          onChange={handleChange}
          required 
        />
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email}
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

        <div className="password-input-container">
          <input 
            type={showSecurityKey ? "text" : "password"} 
            name="securityKey"
            placeholder="Security Key" 
            value={formData.securityKey}
            onChange={handleChange}
            required 
          />
          <EyeIcon show={showSecurityKey} toggle={() => setShowSecurityKey(!showSecurityKey)} />
        </div>
        
        <div className="button-group">
          <button type="button" className="btn-reset" onClick={handleReset}>RESET</button>
          <button type="submit" className="btn-submit">SUBMIT</button>
        </div>
      </form>
    </div>
  );
}

export default Developer;
