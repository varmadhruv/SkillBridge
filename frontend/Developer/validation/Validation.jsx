import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './Validation.css';

function Validation() {
  const [securityKey, setSecurityKey] = useState('');
  const [otp, setOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const isMounted = React.useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      handleGetOtp();
      isMounted.current = true;
    }
  }, []);

  const handleGetOtp = async () => {
    if (isSendingOtp) return;
    setIsSendingOtp(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/developer-forgot-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        setExpectedOtp(data.otp);
        setOtpSent(true);
        setOtp('');
        toast.success("OTP sent to Developer's registered email!");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("An error occurred while connecting to the server.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!securityKey && !otp) {
      toast.error("Please enter either Security Key or OTP");
      return;
    }
    if (otp && !expectedOtp) {
      toast.error("Please wait for OTP to be sent or use Security Key");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/verify-security-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          securityKey: securityKey.trim(),
          otp: otp.trim(),
          expectedOtp 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Authentication Successful!");
        setTimeout(() => {
          window.location.href = '/Developer/dev_create_ac/';
        }, 1500);
      } else {
        toast.error(data.message || "Invalid Security Key or OTP");
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
    <>
    <div className="validation-container">
      <Toaster position="top-right" />
      <div className="brand-text">SkillBridge</div>
      <div className="auth-heading">Authentication</div>
      
      <form onSubmit={handleSubmit} className="validation-form">
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px', textAlign: 'center' }}>
          An OTP has been sent to the Developer's registered email.
        </p>
        
        <div className="horizontal-inputs" style={{ display: 'flex', gap: '10px' }}>
          <div className="password-input-container" style={{ flex: 1 }}>
            <input 
              type={showKey ? "text" : "password"} 
              placeholder="Security Key" 
              value={securityKey}
              onChange={(e) => setSecurityKey(e.target.value)}
            />
            <EyeIcon show={showKey} toggle={() => setShowKey(!showKey)} />
          </div>
          <div className="password-input-container" style={{ flex: 1 }}>
            <input 
              type="text" 
              placeholder="Enter OTP" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-submit" style={{ marginTop: '20px' }}>SUBMIT</button>
        
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <span 
            onClick={!isSendingOtp ? handleGetOtp : null} 
            style={{ 
              color: isSendingOtp ? '#999' : '#6366f1', 
              cursor: isSendingOtp ? 'default' : 'pointer', 
              fontSize: '14px', 
              fontWeight: '500' 
            }}
          >
            {isSendingOtp ? "Sending OTP..." : "Resend OTP"}
          </span>
        </div>
      </form>
    </div>
    <button className="back-btn" onClick={() => window.location.href = '/Developer/Login/'}>Back</button>
    </>
  );
}

export default Validation;
