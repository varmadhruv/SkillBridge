import "./about_us.css";
import { useEffect, useState } from "react";

const MAX_FEEDBACK_LENGTH = 700;

function Feedback() {
  const [mentorName, setMentorName] = useState((localStorage.getItem("mentorFullName") || "Mentor").trim() || "Mentor");
  const [feedbackText, setFeedbackText] = useState("");
  const [mentorId, setMentorId] = useState((localStorage.getItem("mentorId") || "").trim());
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ text: "", type: "" });

  useEffect(() => {
    const storedMentorId = (localStorage.getItem("mentorId") || "").trim();
    if (storedMentorId) {
      setMentorId(storedMentorId);
    }
    if (!storedMentorId) return;

    const fetchMentorProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/mentor-record/${storedMentorId}`);
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

  const handleReset = () => {
    setFeedbackText("");
    setRating(0);
    setHoveredStar(0);
    setSubmitStatus({ text: "", type: "" });
  };

  const handleSubmitFeedback = async (event) => {
    event.preventDefault();
    const trimmedFeedback = feedbackText.trim();

    if (!mentorId) {
      setSubmitStatus({ text: "User ID not found. Please login again.", type: "error" });
      return;
    }

    if (!trimmedFeedback || rating === 0) {
      setSubmitStatus({ text: "Please enter feedback and select rating before submit.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ text: "Submitting...", type: "info" });

    try {
      const response = await fetch("http://127.0.0.1:5000/mentor-feedback-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: mentorId,
          fullName: mentorName,
          feedback: trimmedFeedback,
          rating
        })
      });
      const responseText = await response.text();
      let data = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        if (response.status === 404) {
          setSubmitStatus({ text: "Feedback API route not found. Please restart backend server.", type: "error" });
          return;
        }
        setSubmitStatus({ text: data?.message || "Failed to submit feedback.", type: "error" });
        return;
      }

      handleReset();
      setSubmitStatus({ text: "Feedback submitted successfully.", type: "success" });
    } catch {
      setSubmitStatus({ text: "Server is not reachable right now. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button type="button" className="mentor-nav-item mentor-nav-item-active">
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
        <h2 className="mentor-about-script-heading mentor-feedback-title">Your Feedback Matters</h2>
      </header>

      <section className="mentor-about-card mentor-feedback-box" aria-label="Feedback section">
        <form className="mentor-feedback-form-custom" onSubmit={handleSubmitFeedback}>
          <textarea
            className="mentor-feedback-textarea"
            value={feedbackText}
            onChange={(event) => setFeedbackText(event.target.value.slice(0, MAX_FEEDBACK_LENGTH))}
            placeholder="Share your feedback..."
            rows={5}
            disabled={isSubmitting}
          />

          <div className="mentor-feedback-rating-block">
            <p className="mentor-feedback-rating-label">Rate your Entire Experience</p>
            <div className="mentor-feedback-stars" role="radiogroup" aria-label="Rate your entire experience">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoveredStar || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    className={`mentor-feedback-star ${active ? "mentor-feedback-star-active" : ""}`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    disabled={isSubmitting}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          {submitStatus.text ? (
            <p className={`mentor-feedback-submit-status mentor-feedback-submit-status-${submitStatus.type}`}>
              {submitStatus.text}
            </p>
          ) : null}

          <div className="mentor-feedback-actions">
            <button type="button" className="mentor-feedback-btn" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </button>
            <button type="submit" className="mentor-feedback-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Feedback;
