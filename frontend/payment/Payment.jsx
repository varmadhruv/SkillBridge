import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './Payment.css';

function Payment() {
  const [mentorData, setMentorData] = useState({});
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [paymentLinkId, setPaymentLinkId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('selectedMentor') || '{}');
    setMentorData(data);
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    if (data.fullName) {
      fetchPaymentLink(data.fullName);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (paymentLinkId && !paymentSuccess) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://127.0.0.1:5000/check-payment-link/${paymentLinkId}`);
          const linkData = await res.json();
          if (linkData.status === 'paid') {
            toast.success('Payment Received');
            setPaymentSuccess(true);
            clearInterval(interval);
          }
        } catch (e) {
          console.error("Error checking payment status:", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [paymentLinkId, paymentSuccess]);

  const fetchPaymentLink = async (mentorName) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 40, mentorName: mentorName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server Error ${response.status}: ${errorData.error || errorData.message || 'Unknown Error'}`);
      }
      
      const data = await response.json();
      if (data.short_url) {
        setPaymentLinkId(data.id);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.short_url)}`;
        setQrImageUrl(qrUrl);
      }
    } catch (err) {
      console.error('Error fetching Payment Link:', err);
      setError(err.message || 'Error connecting to backend');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderResponse = await fetch('http://127.0.0.1:5000/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 40 })
      });
      const order = await orderResponse.json();

      const options = {
        key: 'rzp_test_SjXEqbILXUgWv2',
        amount: order.amount,
        currency: order.currency,
        name: 'SkillBridge',
        description: `1hr UPI Payment - ${mentorData.fullName}`,
        order_id: order.id,
        config: {
          display: {
            blocks: {
              banks: {
                name: 'UPI Options',
                instruments: [
                  {
                    method: 'upi'
                  }
                ]
              }
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async function (response) {
          const verifyResponse = await fetch('http://127.0.0.1:5000/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          const verifyResult = await verifyResponse.json();
          if (verifyResult.message === 'Payment verified successfully') {
            toast.success('Payment Received');
            setPaymentSuccess(true);
          } else {
            alert('Payment Verification Failed!');
          }
        },
        prefill: {
          name: localStorage.getItem('studentFullName') || '',
          method: 'upi' // Default to UPI
        },
        theme: {
          color: '#6366f1'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Backend connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="payment-container success-container">
          <div className="success-icon" style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
          <h1>Payment Successful!</h1>
          <p>Your payment for the mentorship session with <strong>{mentorData.fullName}</strong> was successful.</p>
          <button 
            className="payment-btn primary" 
            style={{ marginTop: '30px' }}
            onClick={() => window.location.href = "/Zoom/"}
          >
            Start Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="payment-container">
        <h1>UPI Payment Only</h1>
        
        <div className="payment-summary">
          <h3>Payment Summary</h3>
          <div className="summary-item">
            <span>Mentor:</span>
            <span>{mentorData.fullName || 'Selected Mentor'}</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>₹40</span>
          </div>
        </div>

        <div className="qr-section">
          <h3>Scan QR for UPI Payment</h3>
          <div className="qr-wrapper">
            {qrImageUrl ? (
              <img src={qrImageUrl} alt="UPI QR" className="payment-qr" />
            ) : (
              <div className="qr-loader">
                {error ? (
                  <p className="error-text">{error}</p>
                ) : (
                  <>
                    <div className="spinner"></div>
                    <p>Generating UPI QR...</p>
                  </>
                )}
              </div>
            )}
          </div>
          <p className="qr-note">Scan with GPay, PhonePe, or Paytm</p>
        </div>

        <div className="divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <div className="payment-methods">
          <button 
            className="payment-btn primary" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay via UPI Apps (Mobile)'}
          </button>
        </div>
        
        <button className="cancel-btn" onClick={() => window.location.href = "/Home_page/"}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Payment;



