import React from "react";
import "./Sections.css";

function Help() {
  return (
    <div className="section-container">
      <header className="section-header">
        <h2 className="script-heading title-large">Help Center</h2>
      </header>

      <section className="info-card help-box">
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
    </div>
  );
}

export default Help;
