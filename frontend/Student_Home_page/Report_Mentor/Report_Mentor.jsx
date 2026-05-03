import React, { useState } from "react";
import "./Report_Mentor.css";

const Report_Mentor = () => {
  const [formData, setFormData] = useState({
    mentorName: "",
    mentorImage: null,
    issue: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, mentorImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("mentorName", formData.mentorName);
    formDataToSend.append("issue", formData.issue);
    if (formData.mentorImage) {
      formDataToSend.append("mentorImage", formData.mentorImage);
    }

    try {
      const response = await fetch("http://localhost:5000/submit-report", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Report submitted successfully! Our team will review it shortly.");
        setFormData({ mentorName: "", mentorImage: null, issue: "" });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again later.");
    }
  };

  return (
    <div className="section-container">
      <div className="report-mentor-container">
        <div className="report-card">
          <div className="report-header">
            <h2 className="report-title">Report Mentor</h2>
            <p className="report-subtitle">
              Help us maintain a safe community. Provide details about the incident or mentor behavior below.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="report-form">
            <div className="input-group">
              <label htmlFor="mentorName">
                <span>👤</span> Mentor's Name
              </label>
              <input
                type="text"
                id="mentorName"
                name="mentorName"
                value={formData.mentorName}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="mentorImage">
                <span>📸</span> Upload Evidence
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="mentorImage"
                  name="mentorImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <div className="file-custom-design">
                  <span className="upload-icon">📤</span>
                  <span>Drag & Drop or Click</span>
                  <p className="caption">Click using your phone</p>
                </div>
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="issue">
                <span>⚠️</span> Describe the Issue
              </label>
              <textarea
                id="issue"
                name="issue"
                value={formData.issue}
                onChange={handleInputChange}
                placeholder="Please be specific about what happened..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Submit Formal Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report_Mentor;
