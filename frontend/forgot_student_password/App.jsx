import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './ForgotPassword.css';

function App() {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showRe, setShowRe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Stored from server response
  const [serverOtp, setServerOtp] = useState('');
  const [studentId, setStudentId] = useState('');

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email.trim()) { toast.error('Please enter your registered email'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/forgot-student-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setServerOtp(data.otp);
        setStudentId(data.studentId);
        setEmailSubmitted(true);
        toast.success('OTP sent to your registered email!');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch {
      toast.error('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/forgot-student-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setServerOtp(data.otp);
        setOtp(['', '', '', '', '', '']);
        toast.success('New OTP sent!');
      } else {
        toast.error(data.message || 'Failed to resend');
      }
    } catch {
      toast.error('Server error.');
    } finally {
      setIsResending(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value && element.nextSibling) element.nextSibling.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 6) { toast.error('Please enter the complete 6-digit OTP'); return; }
    if (entered === serverOtp) {
      setOtpVerified(true);
      toast.success('OTP verified! Set your new password.');
    } else {
      toast.error('Incorrect OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      document.querySelector('.otp-row input')?.focus();
    }
  };

  // Step 4: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword.trim() || !rePassword.trim()) { toast.error('Please fill both password fields'); return; }
    if (newPassword.trim() !== rePassword.trim()) { toast.error('Passwords do not match'); return; }
    if (newPassword.trim().length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/reset-student-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, newPassword: newPassword.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successfully! Redirecting...');
        setTimeout(() => { window.location.href = '/LogIn/Student_LogIn/index.html'; }, 1500);
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch {
      toast.error('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <Toaster position="top-right" />
      <div className="fp-card">
        {/* Header */}
        <div className="fp-brand">SkillBridge</div>
        <div className="fp-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1 className="fp-title">Reset Password</h1>
        <p className="fp-subtitle">
          {!emailSubmitted
            ? 'Enter your registered student email to receive an OTP'
            : !otpVerified
            ? 'Enter the 6-digit OTP sent to your email'
            : 'Set your new password'}
        </p>

        {/* Step 1: Email input */}
        {!emailSubmitted && (
          <div className="fp-step">
            <div className="fp-input-wrap">
              <svg className="fp-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                placeholder="Registered Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
              />
            </div>
            <button className="fp-btn-primary" onClick={handleSendOtp} disabled={isLoading}>
              {isLoading ? <span className="fp-spinner" /> : 'Send OTP'}
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {emailSubmitted && !otpVerified && (
          <div className="fp-step">
            <p className="fp-email-hint">OTP sent to <strong>{email}</strong></p>
            <div className="otp-row">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={e => handleOtpChange(e.target, i)}
                  onKeyDown={e => handleOtpKeyDown(e, i)}
                  onFocus={e => e.target.select()}
                  className="otp-box"
                />
              ))}
            </div>
            <button className="fp-btn-primary" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
            <button
              className="fp-btn-resend"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : '↺ Resend OTP'}
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {otpVerified && (
          <div className="fp-step">
            <div className="fp-pass-wrap">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Create New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <span className="fp-eye" onClick={() => setShowNew(!showNew)}>
                {showNew
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </span>
            </div>
            <div className="fp-pass-wrap">
              <input
                type={showRe ? 'text' : 'password'}
                placeholder="Re-enter New Password"
                value={rePassword}
                onChange={e => setRePassword(e.target.value)}
              />
              <span className="fp-eye" onClick={() => setShowRe(!showRe)}>
                {showRe
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </span>
            </div>
            <button className="fp-btn-primary" onClick={handleResetPassword} disabled={isLoading}>
              {isLoading ? <span className="fp-spinner" /> : 'Submit'}
            </button>
          </div>
        )}

        <button className="fp-back-link" onClick={() => window.location.href = '/LogIn/Student_LogIn/index.html'}>
          ← Back to Student Login
        </button>
      </div>
    </div>
  );
}

export default App;
