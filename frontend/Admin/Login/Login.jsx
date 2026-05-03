import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    AdminName: '',
    AdminUsername: '',
    AdminPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showToast = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminId', data.adminId);
        localStorage.setItem('AdminName', data.AdminName);
        localStorage.setItem('tempOtp', data.otp);
        localStorage.setItem('tempEmail', data.adminEmail);
        
        window.location.href = '/Admin/admin_otp_authentication/index.html';
      } else {
        showToast(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      showToast('An error occurred while connecting to the server.');
    }
  };

  const handleReset = () => {
    setFormData({
      AdminName: '',
      AdminUsername: '',
      AdminPassword: ''
    });
  };

  const handleBack = () => {
    window.location.href = '/Dive_in/index.html';
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
    <div className="login-wrapper">
      {error && (
        <div className="toast-notification">
          <div className="toast-icon">⚠️</div>
          <div className="toast-content">{error}</div>
        </div>
      )}

      <div className="admin-login-box">
        <div className="brand-title">SkillBridge</div>
        
        <div className="center-content">
          <h1 className="login-title">Login Page</h1>
          <p className="login-subtitle">Welcome Back ! Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container">
            <input
              type="text"
              name="AdminName"
              value={formData.AdminName}
              onChange={handleChange}
              placeholder="Admin Name"
              required
            />
            <input
              type="text"
              name="AdminUsername"
              value={formData.AdminUsername}
              onChange={handleChange}
              placeholder="Admin Username"
              required
            />
            <div className="password-field-container" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="AdminPassword"
                value={formData.AdminPassword}
                onChange={handleChange}
                placeholder="Admin Password"
                required
                style={{ width: '100%' }}
              />
              <EyeIcon show={showPassword} toggle={() => setShowPassword(!showPassword)} />
            </div>
            <div 
              className="forgot-passcode" 
              onClick={() => window.location.href = '/forgot_admin_password/index.html'}
              style={{ cursor: 'pointer', textAlign: 'right', marginTop: '5px', color: '#7b2cbf', fontSize: '0.9rem', width: '100%' }}
            >
              Forgot password?
            </div>
          </div>

          <div className="button-group">
            <button type="button" className="btn btn-reset" onClick={handleReset}>Reset</button>
            <button type="button" className="btn btn-back" onClick={handleBack}>Back</button>
            <button type="submit" className="btn btn-check">Check</button>
          </div>
        </form>
      </div>

      <a href="/Admin/Login/Contact_us/contact_us.html" className="admin-login-contact-link">Contact Us</a>
    </div>
  );
}

export default Login;
