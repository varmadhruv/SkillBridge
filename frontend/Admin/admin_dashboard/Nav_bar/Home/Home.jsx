import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './Home.css';

function Home() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMentors = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/mentor-records');
      const result = await response.json();
      
      if (response.ok) {
        setMentors(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch mentors');
      }
    } catch (err) {
      setError('Error connecting to server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleStatusUpdate = async (mentorId, newStatus) => {
    if (!window.confirm(`Are you sure you want to declare this mentor as ${newStatus}?`)) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/mentor-status/${mentorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.ok) {
        setMentors(prevMentors => 
          prevMentors.map(mentor => 
            mentor._id === mentorId ? { ...mentor, status: newStatus } : mentor
          )
        );
        if (newStatus === 'Verified') {
          toast.success("Mentor Verified");
        } else {
          toast.success(`Mentor status updated to ${newStatus}`);
        }
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (err) {
      toast.error('Error connecting to server while updating status.');
      console.error(err);
    }
  };

  const handleLogoutAction = async (mentorId) => {
    if (!window.confirm("Are you sure you want to log out this mentor? This will delete the record.")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/mentor-logout/${mentorId}`, { method: 'POST' });
      if (response.ok) {
        setMentors(prev => prev.filter(m => m._id !== mentorId));
        toast.success("Mentor Logged Out Successfully");
      } else {
        toast.error("Failed to logout mentor");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  const handleBlockAction = async (mentorId) => {
    if (!window.confirm("Are you sure you want to block this mentor?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/admin/mentor-block/${mentorId}`, { method: 'POST' });
      if (response.ok) {
        setMentors(prev => prev.filter(m => m._id !== mentorId));
        toast.success("Mentor Blocked Successfully");
      } else {
        toast.error("Failed to block mentor");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  if (loading) return <div className="home-loading">Loading mentors...</div>;
  if (error) return <div className="home-error">{error}</div>;

  return (
    <div className="admin-home-container">
      <Toaster position="top-right" />
      <h1 className="home-title">Mentor Verification Dashboard</h1>
      
      {mentors.length === 0 ? (
        <div className="no-mentors">No mentors registered yet.</div>
      ) : (
        <div className="mentors-grid">
          {mentors.map(mentor => (
            <div key={mentor._id} className="mentor-card">
              <div className="mentor-header">
                <img 
                  src={mentor.photoUrl || 'https://via.placeholder.com/100'} 
                  alt="Mentor" 
                  className="mentor-photo"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                />
                <div className="mentor-info">
                  <h2>{mentor.fullName}</h2>
                  <span className={`status-badge status-${(mentor.status || 'Pending').toLowerCase()}`}>
                    {mentor.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="mentor-details">
                <p><strong>Email:</strong> {mentor.email}</p>
                <p><strong>Phone:</strong> {mentor.phone}</p>
                <p><strong>Experience:</strong> {mentor.teachingExperience} Years</p>
                <p><strong>Specialization:</strong> {mentor.specializedSubject}</p>
                <p><strong>Highest Education:</strong> {mentor.highestEducation}</p>
              </div>

              <div className="mentor-actions">
                {['Verified', 'Spam'].includes(mentor.status) ? (
                  <div className="status-locked-msg">
                    Action Taken: <strong>{mentor.status}</strong>
                  </div>
                ) : (
                  <>
                    <button 
                      className="action-btn btn-verify"
                      onClick={() => handleStatusUpdate(mentor._id, 'Verified')}
                    >
                      Verify
                    </button>
                    <button 
                      className="action-btn btn-logout"
                      onClick={() => handleLogoutAction(mentor._id)}
                    >
                      Logout
                    </button>
                    <button 
                      className="action-btn btn-block"
                      onClick={() => handleBlockAction(mentor._id)}
                      style={{ backgroundColor: '#1e293b' }}
                    >
                      Block
                    </button>
                    <button 
                      className="action-btn btn-spam"
                      onClick={() => handleStatusUpdate(mentor._id, 'Spam')}
                      style={{ backgroundColor: '#ef4444' }}
                    >
                      Spam
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
