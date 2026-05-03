import React, { useState, useEffect } from 'react';
import './Checkout.css';
import toast, { Toaster } from 'react-hot-toast';

function Checkout() {
  const [mentor, setMentor] = useState(null);
  const [studentId] = useState(() => {
    const id = localStorage.getItem('studentId');
    return id ? id.replace(/"/g, '') : null;
  });
  const [studentName] = useState(localStorage.getItem('studentFullName'));
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedMentor = localStorage.getItem('selectedMentor');
    if (savedMentor) {
      setMentor(JSON.parse(savedMentor));
    } else {
      window.location.href = "/Home_page/";
    }
  }, []);

  // Poll for status updates
  useEffect(() => {
    if (!mentor || !studentId) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/booking-status/${studentId}/${mentor._id}`);
        const data = await response.json();
        if (data.data) {
          setBookingStatus(data.data.status);
        } else {
          setBookingStatus(null);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [mentor, studentId]);

  const handleCheckAvailability = async () => {
    if (!studentId || studentId === "null" || studentId === "undefined") {
      toast.error("You must be logged in to book a mentor.");
      window.location.href = "/LogIn/";
      return;
    }
    setLoading(true);
    try {
      // Fetch latest student data to ensure we have all details
      const studentRes = await fetch(`http://127.0.0.1:5000/student-record/${studentId}`);
      const studentData = await studentRes.json();
      
      if (!studentData.data) {
        toast.error("Student profile not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      const s = studentData.data;

      const studentPhotoUrl = `http://127.0.0.1:5000/student-photo/${studentId}`;
      const response = await fetch('http://127.0.0.1:5000/booking-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          mentorId: mentor._id,
          studentName: s.fullName,
          studentPhotoUrl,
          studentEmail: s.email,
          studentCourse: s.course,
          studentYear: s.year
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Availability request sent to mentor!");
        setBookingStatus('Pending');
      } else {
        toast.error(data.message || "Failed to send request");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    window.location.href = "/payment/";
  };

  const handleCancelRequest = async (silent = false) => {
    if (!silent && !window.confirm("Are you sure you want to cancel your request?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/booking-request/${studentId}/${mentor._id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success("Request cancelled");
        setBookingStatus(null);
      } else {
        toast.error("Failed to cancel request");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  if (!mentor) return <div className="loading">Loading...</div>;

  return (
    <div className="checkout-page">
      <Toaster position="top-center" />
      <div className="checkout-card">
        <div className="checkout-header">
          <h1>Booking Summary</h1>
          <button className="close-btn" onClick={() => window.location.href = "/Home_page/"}>×</button>
        </div>

        <div className="checkout-content">
          <div className="mentor-info-section">
            <div className="mentor-photo-wrapper">
              <img src={mentor.photoUrl} alt={mentor.fullName} className="checkout-mentor-img" />
            </div>
            <div className="mentor-details-wrapper">
              <h2>{mentor.fullName}</h2>
              <p className="specialty">{mentor.specializedSubject} Specialist</p>
              <div className="stats">
                <span>{mentor.teachingExperience} yrs Exp.</span>
                <span>⭐ 4.9</span>
              </div>
            </div>
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Session Fee (1 hr)</span>
              <span>₹40.00</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹40.00</span>
            </div>
          </div>

          <div className="action-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              className="availability-btn" 
              onClick={handleCheckAvailability}
              disabled={loading || bookingStatus === 'Pending' || bookingStatus === 'Available'}
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', cursor: (loading || bookingStatus) ? 'not-allowed' : 'pointer', background: bookingStatus === 'Available' ? '#4CAF50' : '#7b2cbf', color: 'white', fontWeight: 'bold' }}
            >
              {loading ? "Checking..." : 
               bookingStatus === 'Pending' ? "Waiting for mentor to confirm..." : 
               bookingStatus === 'Available' ? "Mentor Available!" : 
               bookingStatus === 'Declined' ? "Mentor Unavailable" :
               "Check Mentor Availability"}
            </button>
            
            <button 
              className="payment-btn-main" 
              onClick={handlePayment}
              disabled={bookingStatus !== 'Available'}
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', cursor: bookingStatus === 'Available' ? 'pointer' : 'not-allowed', background: bookingStatus === 'Available' ? '#10b981' : '#ccc', color: bookingStatus === 'Available' ? 'white' : '#666', fontWeight: 'bold' }}
            >
              Make Payment
            </button>

            {(bookingStatus === 'Pending' || bookingStatus === 'Declined') && (
              <button 
                className="cancel-req-btn" 
                onClick={() => handleCancelRequest(bookingStatus === 'Declined')}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {bookingStatus === 'Declined' ? "Try Another Mentor" : "Cancel Request"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;



