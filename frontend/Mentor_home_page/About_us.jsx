import "./about_us.css";
import { useEffect, useState } from "react";

function AboutUs() {
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
          <button type="button" className="mentor-nav-item mentor-nav-item-active">
            About Us
          </button>
          <button type="button" className="mentor-nav-item" onClick={() => (window.location.href = "contact_us.html")}>
            Contact Us
          </button>
          <button type="button" className="mentor-nav-item" onClick={() => (window.location.href = "feedback.html")}>
            Feedback
          </button>
          <button type="button" className="mentor-nav-item" onClick={() => (window.location.href = "help.html")}>
            Help
          </button>
          <button type="button" className="mentor-nav-item">
            Updates
          </button>
        </nav>
      </header>

      <header className="mentor-about-header">
        <h2 className="mentor-about-script-heading">Did You Know About Us ?</h2>
      </header>

      <section className="mentor-about-card mentor-about-highlight-card">
        <p>
          We are a dedicated learning platform designed to bridge the gap between students seeking academic support and
          individuals who have strong subject knowledge but limited opportunities to teach.
        </p>
        <p>
          Our web application allows students to log in and connect with mentors based on their specific doubts or
          challenging subjects. Whether it is understanding complex concepts, preparing for exams, or building
          effective study strategies, students can receive personalized guidance tailored to their needs.
        </p>
        <p>
          At the same time, we empower knowledgeable students and individuals to become mentors. Many talented learners
          possess excellent subject expertise but lack formal teaching experience or long-term availability. Our
          platform provides them with an opportunity to share their knowledge, assist others, and earn income, even
          during short periods such as holidays or semester breaks.
        </p>
        <p>This creates a mutually beneficial ecosystem where:</p>
        <ul>
          <li>Students get their doubts resolved quickly and effectively.</li>
          <li>Mentors gain practical teaching experience and earn rewards.</li>
        </ul>
        <p>
          Especially during exam periods, our platform becomes a reliable support system where students can clarify
          doubts, strengthen concepts, and develop better study strategies to perform at their best.
        </p>
        <p>Our mission is simple:</p>
        <p className="mentor-about-mission">
          To help students learn in a way they never have before, clearer, smarter, and more confidently, by making
          quality guidance accessible whenever they need it.
        </p>
        <p className="mentor-about-signoff">-Team SkillRadius</p>
      </section>

    </main>
  );
}

export default AboutUs;
