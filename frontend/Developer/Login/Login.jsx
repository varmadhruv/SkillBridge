import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/developer-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Login Successful!");
        localStorage.setItem("tempOtp", data.otp);
        localStorage.setItem("tempEmail", data.email);
        setTimeout(() => {
          window.location.href = '/Developer/dev_home/index.html';
        }, 1500);
      } else {
        toast.error(data.message || "Invalid credentials");
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
    <div className="login-container">
      <Toaster position="top-right" />
      <div className="login-brand">SkillBridge</div>
      <div className="login-welcome">Welcome Back !</div>
      
      <form onSubmit={handleCheck} className="login-form">
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

        <div 
          className="forgot-passcode" 
          onClick={() => window.location.href = '/forgot_dev_password/index.html'}
          style={{ cursor: 'pointer', textAlign: 'right', marginTop: '5px', color: '#7b2cbf', fontSize: '0.9rem' }}
        >
          Forgot password?
        </div>
        
        <div className="login-btn-container">
          <button type="button" className="btn-back" onClick={() => window.location.href = '/Role_Page/index.html'}>Back</button>
          <button type="submit" className="btn-check">Check</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
