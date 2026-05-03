import "./home.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Home() {
  const [mentorName, setMentorName] = useState((localStorage.getItem("mentorFullName") || "Mentor").trim() || "Mentor");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(localStorage.getItem("mentorPhotoUrl") || "");
  const [mentorDetails, setMentorDetails] = useState(null);
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const mentorId = localStorage.getItem("mentorId");
  const detailRows = [
    { label: "Full Name", value: mentorDetails?.fullName || mentorName || "--" },
    { label: "Date of Birth", value: mentorDetails?.dob || "--" },
    { label: "Gender", value: mentorDetails?.gender || "--" },
    { label: "Phone Number", value: mentorDetails?.phone || "--" },
    { label: "Email", value: mentorDetails?.email || "--" },
    { label: "Teaching Experience", value: mentorDetails?.teachingExperience || "--" },
    { label: "Specialized Subject", value: mentorDetails?.specializedSubject || "--" },
    { label: "Subjects Taught", value: mentorDetails?.subjectsTaught || "--" },
    { label: "Currently Teaching", value: mentorDetails?.currentlyTeaching || "--" },
    { label: "Institute Name", value: mentorDetails?.instituteName || "--" },
    { label: "Description", value: mentorDetails?.description || "--" },
    { label: "UserName", value: mentorDetails?.mentorUsername || "--" },
    { label: "Password", value: mentorDetails?.mentorPassword || "--" }
  ];
  const firstGroup = detailRows.slice(0, 7);
  const secondGroup = detailRows.slice(7);
  const maskValue = (value) => {
    const normalized = String(value || "");
    if (!normalized || normalized === "--") return "--";
    return "•".repeat(normalized.length);
  };

  const renderDetailRow = (item) => {
    const isUsernameField = item.label === "UserName";
    const isPasswordField = item.label === "Password";
    const shouldMask = (isUsernameField && !showUsername) || (isPasswordField && !showPassword);
    const displayValue = shouldMask ? maskValue(item.value) : item.value;

    return (
      <p key={item.label}>
        <span>{item.label}</span> : {displayValue}
        {isUsernameField ? (
          <button type="button" className="mentor-eye-btn" onClick={() => setShowUsername((prev) => !prev)}>
            {showUsername ? "Hide" : "Show"}
          </button>
        ) : null}
        {isPasswordField ? (
          <button type="button" className="mentor-eye-btn" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        ) : null}
      </p>
    );
  };

  const openAboutPage = () => {
    window.location.href = "about_us.html";
  };
  const openContactPage = () => {
    window.location.href = "contact_us.html";
  };
  const openFeedbackPage = () => {
    window.location.href = "feedback.html";
  };
  const openHelpPage = () => {
    window.location.href = "help.html";
  };
  const openUpdatesPage = () => {
    window.location.href = "updates.html";
  };
  const openRolePage = () => {
    window.location.href = "/Role_Page/";
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const parseApiResponse = async (response) => {
        const raw = await response.text();
        try {
          return raw ? JSON.parse(raw) : {};
        } catch (_parseError) {
          return {};
        }
      };

      const deleteById = async (targetId) => {
        const response = await fetch(`http://127.0.0.1:5000/mentor-record/${targetId}`, {
          method: "DELETE"
        });
        const data = await parseApiResponse(response);
        return { response, data };
      };

      const fallbackResolveId = async () => {
        const recordsResponse = await fetch("http://127.0.0.1:5000/mentor-records");
        const recordsData = await parseApiResponse(recordsResponse);
        const mentors = Array.isArray(recordsData?.data) ? recordsData.data : [];

        const currentUsername = String(mentorDetails?.mentorUsername || "").trim().toLowerCase();
        const currentEmail = String(mentorDetails?.email || "").trim().toLowerCase();
        const currentFullName = String(mentorDetails?.fullName || mentorName || "").trim().toLowerCase();

        const matched = mentors.find((mentor) => {
          const mentorUsername = String(mentor?.mentorUsername || "").trim().toLowerCase();
          const mentorEmail = String(mentor?.email || "").trim().toLowerCase();
          const mentorFullName = String(mentor?.fullName || "").trim().toLowerCase();
          const usernameMatch = currentUsername && mentorUsername === currentUsername;
          const emailMatch = currentEmail && mentorEmail === currentEmail;
          const nameMatch = currentFullName && mentorFullName === currentFullName;
          return usernameMatch || emailMatch || nameMatch;
        });

        return String(matched?._id || "").trim();
      };

      let targetId = String(mentorDetails?._id || localStorage.getItem("mentorId") || "").trim();
      if (!targetId) {
        targetId = await fallbackResolveId();
      }

      if (!targetId) {
        toast.error("Mentor account not found.");
        return;
      }

      let { response, data } = await deleteById(targetId);

      if (!response.ok && (response.status === 400 || response.status === 404)) {
        const resolvedId = await fallbackResolveId();
        if (resolvedId && resolvedId !== targetId) {
          ({ response, data } = await deleteById(resolvedId));
        }
      }

      if (!response.ok) {
        toast.error(data?.message || "Unable to delete the account.");
        return;
      }

      localStorage.removeItem("mentorId");
      localStorage.removeItem("mentorFullName");
      setShowDeleteConfirm(false);
      toast.success("Account deleted successfully.");
      window.location.href = "/Mentor_SignUp/";
    } catch (_error) {
      toast.error("Server connection issue. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const mentorId = (localStorage.getItem("mentorId") || "").trim();
    if (!mentorId) return;

    const fetchMentorProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/mentor-record/${mentorId}`);
        const data = await response.json();
        if (!response.ok) return;

        const resolvedName = String(data?.data?.fullName || "").trim();
        if (resolvedName) {
          setMentorName(resolvedName);
          localStorage.setItem("mentorFullName", resolvedName);
        }

        const resolvedPhotoUrl = String(data?.data?.photoUrl || "").trim();
        if (resolvedPhotoUrl) {
          setProfilePhotoUrl(resolvedPhotoUrl);
          localStorage.setItem("mentorPhotoUrl", resolvedPhotoUrl);
        }

        setMentorDetails(data?.data || null);
      } catch (_error) {
        // Keep fallback localStorage values if fetch fails.
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/mentor-sessions/${mentorId}`);
        const data = await response.json();
        if (response.ok && data.data) {
          setSessions(data.data);
        }
      } catch (_error) {
        console.error("Failed to fetch sessions");
      }
    };

    fetchMentorProfile();
    fetchSessions();
  }, []);

  return (
    <main className="mentor-home-page">
      <header className="mentor-home-topbar">
        <h1 className="mentor-home-name">{mentorName}</h1>
        <nav className="mentor-home-nav" aria-label="Mentor navigation">
          <button type="button" className="mentor-nav-item mentor-nav-item-active">
            Home
          </button>
          <button type="button" className="mentor-nav-item" onClick={openAboutPage}>
            About Us
          </button>
          <button type="button" className="mentor-nav-item" onClick={openContactPage}>
            Contact Us
          </button>
          <button type="button" className="mentor-nav-item" onClick={openFeedbackPage}>
            Feedback
          </button>
          <button type="button" className="mentor-nav-item" onClick={openHelpPage}>
            Help
          </button>
          <button type="button" className="mentor-nav-item" onClick={openUpdatesPage}>
            Updates
          </button>
        </nav>
      </header>
      <section className="mentor-home-main-content">
        <h2 className="mentor-home-dashboard-title">Dashboard</h2>
        <section className="mentor-home-profile-card" aria-label="Mentor profile card">
          <div className="mentor-home-content-row">
            <div className="mentor-home-left-column">
              <div className="mentor-home-photo-frame">
                {(profilePhotoUrl || mentorDetails?.photoUrl) ? (
                  <img src={profilePhotoUrl || mentorDetails?.photoUrl} alt={`${mentorName} profile`} className="mentor-home-photo" />
                ) : (
                  <span className="mentor-home-photo-placeholder">No Image</span>
                )}
              </div>
            </div>
            <section className="mentor-home-details" aria-label="Mentor information">
              <div className="mentor-home-details-track">
                <div className="mentor-home-details-group">
                  {firstGroup.map((item) => renderDetailRow(item))}
                </div>
                <div className="mentor-home-details-group mentor-home-details-group-offset">
                  {secondGroup.map((item) => renderDetailRow(item))}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="mentor-sessions-section" style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <h2 className="mentor-home-dashboard-title" style={{ marginBottom: "15px", borderBottom: "2px solid #6366f1", paddingBottom: "10px", color: "#333" }}>Upcoming Sessions</h2>
          {sessions.length > 0 ? (
            <div className="sessions-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {sessions.map((session, index) => (
                <div key={index} className="session-card" style={{ padding: "15px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "#fafafa" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#6366f1" }}>Session with {session.studentName}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span><strong>Date:</strong> {new Date(session.createdAt).toLocaleDateString()}</span>
                    <a 
                      href={session.startUrl || session.joinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ background: "#6366f1", color: "#fff", padding: "8px 16px", borderRadius: "5px", textDecoration: "none", fontWeight: "bold" }}
                    >
                      Start Zoom Meeting
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#666" }}>No upcoming sessions found.</p>
          )}
        </section>
      </section>

      <div className="mentor-logout-row">
        <button type="button" className="mentor-logout-btn" onClick={() => setShowDeleteConfirm(true)}>
          Logout
        </button>
        <button type="button" className="mentor-logout-btn" onClick={openRolePage}>
          Go Back
        </button>
      </div>

      {showDeleteConfirm ? (
        <div className="mentor-confirm-overlay" role="dialog" aria-modal="true" aria-label="Delete account confirmation">
          <div className="mentor-confirm-box">
            <p className="mentor-confirm-message">Are you sure you want to delete your account?</p>
            <div className="mentor-confirm-actions">
              <button type="button" onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default Home;
