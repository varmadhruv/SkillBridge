import React, { useState, useEffect } from 'react';
import './updates.css';
import toast, { Toaster } from 'react-hot-toast';

function Updates() {
  const [bookingRequests, setBookingRequests] = useState([]);
  const mentorId = localStorage.getItem("mentorId");
  const mentorName = localStorage.getItem("mentorFullName") || "Mentor";

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    if (!mentorId) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/booking-requests/${mentorId}`);
      const data = await response.json();
      if (data.data) {
        setBookingRequests(data.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleSetAvailable = async (requestId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/booking-request/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Available' })
      });
      if (response.ok) {
        toast.success("Availability confirmed!");
        fetchRequests();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSetUnavailable = async (requestId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/booking-request/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Declined' })
      });
      if (response.ok) {
        toast.error("Request declined");
        fetchRequests();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="updates-page">
      <Toaster position="top-center" />
      <header className="updates-topbar">
        <h1>{mentorName}'s Updates</h1>
        <button className="back-home-btn" onClick={() => window.location.href = "/Mentor_home_page/"}>
          Back to Dashboard
        </button>
      </header>

      <main className="updates-container">
        <div className="updates-header">
          <h2>Student Mentorship Requests</h2>
          <p>Review and respond to students waiting for your availability.</p>
        </div>

        <div className="requests-grid">
          {bookingRequests.length > 0 ? (
            bookingRequests.map((req) => (
              <div key={req._id} className="request-card">
                <div className="student-profile">
                  <img src={req.studentPhotoUrl} alt={req.studentName} className="req-student-img" />
                  <div className="req-status-dot"></div>
                </div>
                <div className="req-content">
                  <div className="req-info-group">
                    <h3 className="req-name">{req.studentName}</h3>
                    <p className="req-meta">{req.studentCourse} | Year {req.studentYear}</p>
                    <p className="req-email">{req.studentEmail}</p>
                  </div>
                  <div className="req-time-stamp">
                    Requested at: {new Date(req.requestedAt).toLocaleTimeString()}
                  </div>
                  <div className="req-actions-horizontal">
                    <button className="btn-available" onClick={() => handleSetAvailable(req._id)}>
                      Confirm Available
                    </button>
                    <button className="btn-unavailable" onClick={() => handleSetUnavailable(req._id)}>
                      Not Available
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>All caught up!</h3>
              <p>No new mentorship requests at the moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Updates;
