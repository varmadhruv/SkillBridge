import React, { useState, useEffect } from 'react';
import './Otp_Auth.css';

function Otp_Auth() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [adminName, setAdminName] = useState('');
  const [isResending, setIsResending] = useState(false);
  const isMounted = React.useRef(false);

  useEffect(() => {
    const name = localStorage.getItem('AdminName');
    if (name) setAdminName(name);

    if (!isMounted.current) {
      handleResendOtp();
      isMounted.current = true;
    }
  }, []);

  const handleResendOtp = async () => {
    const email = localStorage.getItem('tempEmail');
    if (!email) {
      setError('Session expired. Please login again.');
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/admin-otp-resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: email })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('tempOtp', data.otp);
        setError('');
        // No toast here as it might be annoying on mount, 
        // but we can add one if user clicked the button
        if (isMounted.current) {
          // Add toast if available or just a message
          console.log("OTP sent!");
        }
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Error connecting to server.');
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    const expectedOtp = localStorage.getItem('tempOtp');

    if (enteredOtp === expectedOtp) {
      localStorage.removeItem('tempOtp');
      window.location.href = '/Admin/admin_dashboard/index.html';
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      // Focus first input after error
      const firstInput = e.target.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  };

  return (
    <div className="validation-container">
      <div className="brand-text">SkillBridge</div>
      <h1 className="auth-heading">Authentication</h1>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px', textAlign: 'center' }}>
        Hello {adminName}, an OTP has been sent to your email.
      </p>
      
      <form onSubmit={handleSubmit} className="validation-form">
        <div className="otp-inputs">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={e => e.target.select()}
              required
            />
          ))}
        </div>
        {error && <div className="error-message" style={{ textAlign: 'center', color: '#e63946', fontSize: '14px' }}>{error}</div>}
        <button type="submit" className="btn-submit" style={{ marginTop: '10px' }}>CHECK</button>
        
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <span 
            onClick={!isResending ? handleResendOtp : null} 
            style={{ 
              color: isResending ? '#999' : '#6366f1', 
              cursor: isResending ? 'default' : 'pointer', 
              fontSize: '14px', 
              fontWeight: '500' 
            }}
          >
            {isResending ? "Sending OTP..." : "Resend OTP"}
          </span>
        </div>
      </form>
      <button className="back-btn" onClick={() => window.location.href = '/Admin/Login/index.html'}>Back</button>
    </div>
  );
}

export default Otp_Auth;
