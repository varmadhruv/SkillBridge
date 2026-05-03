import React, { useState } from "react";
import "./Sections.css";

const MAX_FEEDBACK_LENGTH = 700;

function Feedback({ studentId, studentName }) {
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ text: "", type: "" });

  const handleReset = () => {
    setFeedbackText("");
    setRating(0);
    setHoveredStar(0);
    setSubmitStatus({ text: "", type: "" });
  };

  const handleSubmitFeedback = async (event) => {
    event.preventDefault();
    const trimmedFeedback = feedbackText.trim();

    if (!studentId) {
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
          userId: studentId,
          fullName: studentName,
          feedback: trimmedFeedback,
          rating
        })
      });

      if (!response.ok) {
        setSubmitStatus({ text: "Failed to submit feedback.", type: "error" });
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
    <div className="section-container">
      <header className="section-header">
        <h2 className="script-heading title-large">Your Feedback Matters</h2>
      </header>

      <section className="info-card feedback-box">
        <form className="feedback-form" onSubmit={handleSubmitFeedback}>
          <textarea
            className="feedback-textarea"
            value={feedbackText}
            onChange={(event) => setFeedbackText(event.target.value.slice(0, MAX_FEEDBACK_LENGTH))}
            placeholder="Share your feedback..."
            rows={5}
            disabled={isSubmitting}
          />

          <div className="rating-block">
            <p className="rating-label">Rate your Entire Experience</p>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoveredStar || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${active ? "star-active" : ""}`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    disabled={isSubmitting}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          {submitStatus.text ? (
            <p className={`status-text status-${submitStatus.type}`}>
              {submitStatus.text}
            </p>
          ) : null}

          <div className="form-actions">
            <button type="button" className="action-btn" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </button>
            <button type="submit" className="action-btn submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Feedback;

