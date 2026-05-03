import React, { useEffect, useState } from 'react';
import './Zoom.css';

function Zoom() {
  const [mentorData, setMentorData] = useState({});
  const [sessionLink, setSessionLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const mData = JSON.parse(localStorage.getItem('selectedMentor') || '{}');
    const studentName = localStorage.getItem('studentFullName') || 'Student';
    const studentId = localStorage.getItem('studentId') || 'unknown';
    
    setMentorData(mData);

    if (mData._id && studentId) {
      createMeeting(studentId, mData._id, studentName, mData.fullName);
    } else {
      setError('Missing mentor or student information.');
      setLoading(false);
    }
  }, []);

  const createMeeting = async (studentId, mentorId, studentName, mentorName) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/create-zoom-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, mentorId, studentName, mentorName })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      setSessionLink(data.joinUrl);
    } catch (err) {
      console.error(err);
      setError('Could not generate meeting link. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zoom-page">
      <div className="zoom-container">
        <div className="success-icon">✅</div>
        <h1>Booking Confirmed!</h1>
        <p className="mentor-name">Your session with <strong>{mentorData.fullName}</strong> is scheduled.</p>
        
        <div className="zoom-info">
          <h3>Session Details</h3>
          <div className="info-row">
            <span>Duration:</span>
            <span>1 Hour</span>
          </div>
          <div className="info-row">
            <span>Platform:</span>
            <span>Zoom Video Call</span>
          </div>
        </div>

        <div className="meeting-section">
          {loading ? (
            <p>Generating your secure Zoom link...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <>
              <p>The meeting link is ready.</p>
              <button 
                className="join-btn" 
                onClick={() => window.open(sessionLink, '_blank')}
                disabled={!sessionLink}
              >
                Join Zoom Meeting
              </button>
            </>
          )}
        </div>

        <button className="home-btn" onClick={() => window.location.href = "/Home_page/"}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Zoom;


