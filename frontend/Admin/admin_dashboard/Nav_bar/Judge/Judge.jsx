import React, { useState, useEffect } from 'react';
import './Judge.css';


const API_URL = import.meta.env.VITE_API_URL;
const Judge = () => {
  const [reports, setReports] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchSessions();
    fetchMentors();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/all-sessions`);
      const data = await response.json();
      if (data.data) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await fetch(`${API_URL}/mentor-records`);
      const data = await response.json();
      if (data.data) {
        setMentors(data.data);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/get-reports`);
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
      const mentorResponse = await fetch(`${API_URL}/mentor-records`);
      const mentorData = await mentorResponse.json();
      const mentor = mentorData.data.find(m => m.fullName === mentorName);

      if (!mentor) {
        alert('Mentor not found in active records. They might already be blocked or deleted.');
        return;
      }

      // Block the mentor using the existing block endpoint
      const blockResponse = await fetch(`${API_URL}/admin/mentor-block/${mentor._id}`, {
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

  const handleDismissReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to dismiss this report?")) return;

    try {
      const response = await fetch(`${API_URL}/admin/report/${reportId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setReports(prevReports => prevReports.filter(report => report._id !== reportId));
        alert('Report dismissed successfully.');
      } else {
        alert('Failed to dismiss report.');
      }
    } catch (error) {
      console.error('Error dismissing report:', error);
      alert('An error occurred.');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentProof) {
      alert("Please select a payment proof image.");
      return;
    }

    const formData = new FormData();
    formData.append("paymentProof", paymentProof);

    try {
      const response = await fetch(`${API_URL}/admin-pay-mentor/${selectedSession._id}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert("Payment proof submitted successfully!");
        setShowPaymentModal(false);
        setPaymentProof(null);
        fetchSessions(); // Refresh sessions
      } else {
        alert("Failed to submit payment proof.");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("An error occurred.");
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
                  <button 
                    className="dismiss-btn-admin"
                    onClick={() => handleDismissReport(report._id)}
                    style={{ 
                      marginLeft: '10px', 
                      backgroundColor: '#6c757d', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 15px', 
                      borderRadius: '5px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <hr style={{ margin: "50px 0", border: "none", borderTop: "2px dashed #ccc" }} />

      <h1 className="judge-title">Ledger Center</h1>
      <p className="judge-subtitle">Track and pay mentors for successful sessions.</p>

      <div className="ledger-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "25px", marginTop: "30px" }}>
        {sessions.length === 0 ? (
          <p className="no-reports">No sessions recorded yet.</p>
        ) : (
          sessions.map((session) => {
            const mentor = mentors.find(m => String(m._id).trim() === String(session.mentorId).trim());
            return (
              <div key={session._id} className="ledger-card" style={{ background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", border: "1px solid #eee", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <span style={{ fontSize: "12px", color: "#666" }}>Session ID: {session._id.slice(-6)}</span>
                  <span style={{ 
                    fontSize: "12px", 
                    fontWeight: "700", 
                    padding: "4px 10px", 
                    borderRadius: "20px",
                    background: session.paymentStatus === 'Paid' ? "#d4edda" : "#f8d7da",
                    color: session.paymentStatus === 'Paid' ? "#155724" : "#721c24"
                  }}>
                    {session.paymentStatus}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#7b2cbf" }}>Mentor Details</h4>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}><strong>{session.mentorName}</strong></p>
                    <p style={{ margin: "2px 0", fontSize: "12px", color: "#666" }}>UPI: {mentor?.upiId || "N/A"}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#1a73e8" }}>Student Details</h4>
                    <p style={{ margin: "2px 0", fontSize: "13px" }}><strong>{session.studentName}</strong></p>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: "20px", background: "#f8f9fa", padding: "10px", borderRadius: "10px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>Mentor Payment QR</p>
                  {mentor?.qrUrl ? (
                    <img src={mentor.qrUrl} alt="Mentor QR" style={{ width: "120px", height: "120px", objectFit: "contain", border: "1px solid #ddd" }} />
                  ) : (
                    <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", background: "#eee", fontSize: "11px" }}>QR Not Available</div>
                  )}
                </div>

                {session.paymentStatus !== 'Paid' && (
                  <button 
                    onClick={() => {
                      setSelectedSession(session);
                      setShowPaymentModal(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Make Payment
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {showPaymentModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "15px", maxWidth: "400px", width: "90%" }}>
            <h2 style={{ marginTop: 0 }}>Upload Payment Proof</h2>
            <p style={{ fontSize: "14px", color: "#666" }}>Paying mentor: <strong>{selectedSession?.mentorName}</strong></p>
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ margin: "20px 0" }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setPaymentProof(e.target.files[0])} 
                  required 
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", background: "#1a73e8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Submit Payment</button>
                <button type="button" onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: "10px", background: "#ccc", color: "black", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Judge;
