import React, { useState, useEffect } from 'react';
import './Judge.css';

const Judge = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get-reports');
      const data = await response.json();
      if (data.data) {
        setReports(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const handleBlockMentor = async (mentorName) => {
    if (!window.confirm(`Are you sure you want to block ${mentorName}?`)) return;

    try {
      // First, find the mentor by name
      const mentorResponse = await fetch('http://127.0.0.1:5000/mentor-records');
      const mentorData = await mentorResponse.json();
      const mentor = mentorData.data.find(m => m.fullName === mentorName);

      if (!mentor) {
        alert('Mentor not found in active records. They might already be blocked or deleted.');
        return;
      }

      // Block the mentor using the existing block endpoint
      const blockResponse = await fetch(`http://127.0.0.1:5000/admin/mentor-block/${mentor._id}`, {
        method: 'POST'
      });

      if (blockResponse.ok) {
        alert(`${mentorName} has been blocked successfully.`);
        // Remove the card(s) from the UI after blocking
        setReports(prevReports => prevReports.filter(report => report.mentorName !== mentorName));
      } else {
        alert('Failed to block mentor.');
      }
    } catch (error) {
      console.error('Error blocking mentor:', error);
      alert('An error occurred.');
    }
  };

  if (loading) return <div className="judge-loading">Loading Reports...</div>;

  return (
    <div className="judge-container">
      <h1 className="judge-title">Report Judgement Center</h1>
      <p className="judge-subtitle">Review student complaints and take disciplinary action.</p>
      
      <div className="reports-list">
        {reports.length === 0 ? (
          <p className="no-reports">No pending reports found.</p>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="report-card-admin">
              <div className="report-image-admin">
                {report.photoUrl ? (
                  <img src={report.photoUrl} alt="Evidence" />
                ) : (
                  <div className="no-image-placeholder">No Evidence Image</div>
                )}
              </div>
              
              <div className="report-details-admin">
                <h3>Mentor: <span>{report.mentorName}</span></h3>
                <div className="issue-box">
                  <p className="issue-label">Issue Reported:</p>
                  <p className="issue-text">{report.issue}</p>
                </div>
                <div className="report-meta">
                  <span>Submitted on: {new Date(report.submittedAt).toLocaleString()}</span>
                </div>
                
                <div className="report-actions">
                  <button 
                    className="block-btn-admin"
                    onClick={() => handleBlockMentor(report.mentorName)}
                  >
                    Block Mentor
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Judge;
