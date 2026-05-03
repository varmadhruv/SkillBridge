import React, { useState, useEffect } from "react";
import "./Home_Section.css";

function Home_Section() {
  const [mentors, setMentors] = useState([]);
  const [hoveredMentorId, setHoveredMentorId] = useState(null);
  const [hoveredDetails, setHoveredDetails] = useState(null);

  const [studentSessions, setStudentSessions] = useState([]);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/mentor-records")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setMentors(data.data);
        }
      })
      .catch((err) => console.error("Error fetching mentors:", err));

    if (studentId) {
      fetch(`http://127.0.0.1:5000/student-sessions/${studentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            setStudentSessions(data.data);
          }
        })
        .catch((err) => console.error("Error fetching student sessions:", err));
    }
  }, [studentId]);


  const handleMouseEnter = (mentorId) => {
    setHoveredMentorId(mentorId);
    // Dynamic fetch for individual mentor details on hover
    fetch(`http://127.0.0.1:5000/mentor-record/${mentorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setHoveredDetails(data.data);
        }
      })
      .catch((err) => console.error("Error fetching mentor details:", err));
  };

  const handleMouseLeave = () => {
    setHoveredMentorId(null);
    setHoveredDetails(null);
  };

  return (
    <div className="section-container">
      <div className="offer-banner">
        <span className="offer-tag">Limited Time Offer !</span>
        <h1 className="offer-price">₹40/hr</h1>
      </div>

      <div className="mentor-grid">
        {mentors.map((mentor) => {
          const isHovered = hoveredMentorId === mentor._id;
          const details = isHovered ? hoveredDetails : null;

          return (
            <div 
              key={mentor._id} 
              className={`mentor-card ${isHovered ? "expanded" : ""}`}
              onMouseEnter={() => handleMouseEnter(mentor._id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-inner">
                <div className="img-container">
                  {mentor.photoUrl ? (
                    <img src={mentor.photoUrl} alt={mentor.fullName} className="mentor-img" />
                  ) : (
                    <div className="mentor-img-placeholder">No Photo</div>
                  )}
                </div>

                {isHovered && !details && (
                  <div className="loading-details">
                    <div className="spinner"></div>
                    <p>Loading Details...</p>
                  </div>
                )}

                {isHovered && details && (
                  <div className="mentor-details">
                    <h3 className="detail-name">{details.fullName}</h3>
                    <div className="detail-row">
                      <span className="label">Gender:</span> 
                      <span className="value">{details.gender}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Religion:</span> 
                      <span className="value">{details.religion}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Teaching Experience:</span> 
                      <span className="value">{details.teachingExperience} years</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Specialized Subject:</span> 
                      <span className="value">{details.specializedSubject}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Subject Taught:</span> 
                      <span className="value">{details.subjectsTaught}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Highest Education:</span> 
                      <span className="value">{details.highestEducation}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Study From Where:</span> 
                      <span className="value">{details.studyFromWhere}</span>
                    </div>
                    <div className="detail-row description-row">
                      <span className="label">Description:</span>
                      <p className="description-text">{details.description}</p>
                    </div>
                    <div className="card-actions-container">
                      {!studentSessions.some(session => session.mentorId === mentor._id) && (
                        <button className="checkout-btn" onClick={() => {
                          localStorage.setItem('selectedMentor', JSON.stringify(details));
                          window.location.href = "/Checkout/";
                        }}>Checkout</button>
                      )}

                      <div className="status-badge-container">
                        {studentSessions.some(session => session.mentorId === mentor._id) && (
                          <span className="status-badge engaged">Engaged</span>
                        )}

                        {details.status === 'Verified' && (
                          <span className="status-badge verified">Verified</span>
                        )}
                        {details.status === 'Spam' && (
                          <span className="status-badge spam">Spam</span>
                        )}
                        {details.status === 'Pending' && (
                          <span className="status-badge pending">Pending</span>
                        )}
                        {details.status !== 'Pending' && details.status !== 'Spam' && details.status !== 'Verified' && (
                          <span className="status-badge available">Available</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home_Section;


