import "./contact_us.css";

function ContactUs() {
  return (
    <main className="mentor-about-page">
      <header className="mentor-home-topbar">
        <h1 className="mentor-home-name">Admin Portal</h1>
        <nav className="mentor-home-nav" aria-label="Admin navigation">
          <button type="button" className="mentor-nav-item" onClick={() => (window.location.href = "../index.html")}>
            Back to Login
          </button>
        </nav>
      </header>

      <div className="contact-container">
        <h2 className="contact-heading">
          Feel Free To Reach Out
        </h2>
        <p className="contact-text">
          If you have any questions, suggestions, or need assistance, feel free to reach out to our team. We are always open to feedback and continuously working to improve your experience on the platform.Our team is committed to providing a smooth and helpful learning environment, and we’ll do our best to respond as quickly as possible.
        </p>
      </div>
      <div className="contact-team-card">
        <h3>Our Team</h3>
        
        <div className="team-member">
          <h4>Dhruv Varma – Team Leader & Full Stack Developer</h4>
          <p>(Led the project development, handled core architecture, and implemented major features)</p>
          <a href="mailto:dhruvvarma53@gmail.com" className="team-email">dhruvvarma53@gmail.com</a>
        </div>

        <div className="team-member">
          <h4>Jones Braggs – Frontend Developer</h4>
          <p>(Worked on UI design and user experience to ensure smooth interaction)</p>
          <a href="mailto:jonesbraggs9@gmail.com" className="team-email">jonesbraggs9@gmail.com</a>
        </div>

        <div className="team-member">
          <h4>Gautam Thumma – Backend Developer</h4>
          <p>(Managed server-side logic, database handling, and APIs)</p>
          <a href="mailto:gautam1825@gmail.com" className="team-email">gautam1825@gmail.com</a>
        </div>

        <div className="team-member">
          <h4>Manoj Yadav – Support & Testing</h4>
          <p>(Handled testing, debugging, and ensured platform reliability)</p>
          <a href="mailto:manoj.yadav18002003@gmail.com" className="team-email">manoj.yadav18002003@gmail.com</a>
        </div>
      </div>
    </main>
  );
}

export default ContactUs;
