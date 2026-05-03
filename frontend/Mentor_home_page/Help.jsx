import "./about_us.css";
import { useEffect, useState } from "react";

function Help() {
  const [mentorName, setMentorName] = useState((localStorage.getItem("mentorFullName") || "Mentor").trim() || "Mentor");

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
      } catch (_error) {
        // Keep fallback localStorage values if fetch fails.
      }
    };

    fetchMentorProfile();
  }, []);

  return (
    <main className="mentor-about-page">
      <header className="mentor-home-topbar">
        <h1 className="mentor-home-name">{mentorName}</h1>
        <nav className="mentor-home-nav" aria-label="Mentor navigation">
          <button type="button" className="mentor-nav-item" onClick={() => (window.location.href = "index.html")}>
            Home
          </button>
          <button type="button" className="mentor-nav-item" onClick={() => (window.location.href = "about_us.html")}>
            About Us
          </button>
          <button type="button" className="mentor-nav-item" onClick={() => (window.location.href = "contact_us.html")}>
            Contact Us
          </button>
          <button type="button" className="mentor-nav-item" onClick={() => (window.location.href = "feedback.html")}>
            Feedback
          </button>
          <button type="button" className="mentor-nav-item mentor-nav-item-active">
            Help
          </button>
          <button type="button" className="mentor-nav-item">
            Updates
          </button>
        </nav>
      </header>

      <header className="mentor-about-header">
        <h2 className="mentor-about-script-heading mentor-feedback-title">Help Center</h2>
      </header>

      <section className="mentor-about-card mentor-feedback-box">
        <p>
          This web app is currently optimized for computer screens only. On mobile devices, the user experience may not
          remain consistent, and the UI may not appear properly aligned.
        </p>
        <p>
          If you are facing any issue, first try these troubleshooting steps: check your internet connection, verify
          your device status, and ensure your input devices like keyboard and mouse are working correctly. If the issue
          still continues, please contact us with your corresponding email ID, name, and username.
        </p>
        <p>
          While contacting us, it is mandatory to mention your full name, username, email ID, and phone number. This
          helps us troubleshoot your issue faster and provide accurate support.
        </p>
        <p>
          If a mentor needs to update any details such as username, password, or any other profile information, they
          must log out first. We are currently working on enabling direct updates without requiring logout.
        </p>
      </section>
    </main>
  );
}

export default Help;
