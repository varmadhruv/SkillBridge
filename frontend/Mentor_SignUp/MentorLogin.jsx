import "./Mentor_Login.css";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function MentorLogin() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [showLeftCursor, setShowLeftCursor] = useState(true);
  const [showRightCursor, setShowRightCursor] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const profilePhotoInputRef = useRef(null);
  const [mentorForm, setMentorForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    religion: "",
    phone: "",
    email: "",
    teachingExperience: "",
    specializedSubject: "",
    subjectsTaught: "",
    currentlyTeaching: "No",
    instituteName: "",
    highestEducation: "",
    studyFromWhere: "",
    description: "",
    profilePhoto: null,
    otp: ""
  });
  const [expectedOtp, setExpectedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    const selectedFile = files?.[0] || null;

    if (name === "profilePhoto") {
      setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : "");
    }

    setMentorForm((prev) => ({
      ...prev,
      [name]: name === "profilePhoto" ? selectedFile : value,
      // Clear institute name if teaching is No
      instituteName: name === "currentlyTeaching" && value === "No" ? "" : (name === "instituteName" ? value : prev.instituteName)
    }));
  };

  const handleReset = () => {
    setMentorForm({
      fullName: "",
      dob: "",
      gender: "",
      religion: "",
      phone: "",
      email: "",
      teachingExperience: "",
      specializedSubject: "",
      subjectsTaught: "",
      currentlyTeaching: "No",
      instituteName: "",
      highestEducation: "",
      studyFromWhere: "",
      description: "",
      profilePhoto: null,
      otp: ""
    });
    setOtpSent(false);
    setExpectedOtp(null);
    setPreviewUrl("");
    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const getFieldValue = (field) => {
      const formValue = formData.get(field);
      const normalizedFormValue = typeof formValue === "string" ? formValue.trim() : "";
      if (normalizedFormValue) {
        return normalizedFormValue;
      }

      const stateValue = mentorForm[field];
      return typeof stateValue === "string" ? stateValue.trim() : "";
    };

    formData.set("fullName", getFieldValue("fullName"));
    formData.set("dob", getFieldValue("dob"));
    formData.set("gender", getFieldValue("gender"));
    formData.set("religion", getFieldValue("religion"));
    formData.set("phone", getFieldValue("phone"));
    formData.set("email", getFieldValue("email").toLowerCase());
    formData.set("teachingExperience", getFieldValue("teachingExperience"));
    formData.set("specializedSubject", getFieldValue("specializedSubject"));
    formData.set("subjectsTaught", getFieldValue("subjectsTaught"));
    formData.set("currentlyTeaching", getFieldValue("currentlyTeaching"));
    formData.set("instituteName", getFieldValue("instituteName"));
    formData.set("highestEducation", getFieldValue("highestEducation"));
    formData.set("studyFromWhere", getFieldValue("studyFromWhere"));
    formData.set("description", getFieldValue("description"));

    const selectedPhoto = formData.get("profilePhoto");
    if (selectedPhoto instanceof File && selectedPhoto.name) {
      formData.set("profilePhotoName", selectedPhoto.name);
    }

    // OTP Verification
    if (!otpSent || !expectedOtp) {
      toast.error("Please verify your email with OTP first!");
      return;
    }

    if (mentorForm.otp !== expectedOtp) {
      toast.error("Invalid OTP! Please check and try again.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/mentor-registration", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Submit failed.");
        return;
      }

      if (data?.mentorId) {
        localStorage.setItem("mentorId", data.mentorId);
      }
      if (formData.get("fullName")) {
        localStorage.setItem("mentorFullName", String(formData.get("fullName")));
      }

      toast.success(data?.message || "Registration successful! ✅");
      handleReset();
      window.location.href = "/Mentor_SignUp/aknowledgement.html";
    } catch (_error) {
      toast.error("Connection error. Please try again.");
    }
  };

  const handleSendOtp = async () => {
    if (!mentorForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mentorForm.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/send-registration-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mentorForm.email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setExpectedOtp(data.otp);
        setOtpSent(true);
        toast.success("OTP sent to your email! 📧");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error connecting to server.");
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const getIndiaGreeting = () => {
      const indiaHour = Number(
        new Intl.DateTimeFormat("en-IN", {
          hour: "numeric",
          hour12: false,
          timeZone: "Asia/Kolkata"
        }).format(new Date())
      );

      if (indiaHour < 12) return "Good Morning";
      if (indiaHour < 17) return "Good Afternoon";
      return "Good Evening";
    };

    const firstWord = "Namaste";
    const greetingWord = getIndiaGreeting();
    const timeoutIds = [];

    const schedule = (callback, delay) => {
      const id = setTimeout(callback, delay);
      timeoutIds.push(id);
    };

    const typeText = (text, index = 0) => {
      if (index <= text.length) {
        setShowLeftCursor(true);
        setLeftText(text.slice(0, index));
        schedule(() => typeText(text, index + 1), 100);
      } else if (text === greetingWord) {
        setShowLeftCursor(false);
      }
    };

    const backspaceText = (text, index = text.length) => {
      if (index >= 0) {
        setShowLeftCursor(true);
        setLeftText(text.slice(0, index));
        schedule(() => backspaceText(text, index - 1), 65);
      } else {
        schedule(() => typeText(greetingWord), 220);
      }
    };

    typeText(firstWord);
    schedule(() => backspaceText(firstWord), firstWord.length * 100 + 900);

    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, []);

  useEffect(() => {
    const timeoutIds = [];

    const schedule = (callback, delay) => {
      const id = setTimeout(callback, delay);
      timeoutIds.push(id);
    };

    const typeLine = (text, index = 0, onComplete) => {
      if (index <= text.length) {
        setShowRightCursor(true);
        setRightText(text.slice(0, index));
        schedule(() => typeLine(text, index + 1, onComplete), 85);
      } else if (onComplete) {
        onComplete();
      }
    };

    const backspaceLine = (text, index = text.length, onComplete) => {
      if (index >= 0) {
        setShowRightCursor(true);
        setRightText(text.slice(0, index));
        schedule(() => backspaceLine(text, index - 1, onComplete), 60);
      } else if (onComplete) {
        onComplete();
      }
    };

    typeLine("Welcome!!", 0, () => {
      schedule(() => {
        backspaceLine("Welcome!!", "Welcome!!".length, () => {
          schedule(() => {
            typeLine("Mentor SignUp", 0, () => setShowRightCursor(false));
          }, 160);
        });
      }, 2000);
    });

    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, []);

  return (
    <main className="mentor-page">
      <div className="mentor-left-panel">
        <h1 className="mentor-greeting">
          {leftText}
          {showLeftCursor ? <span className="mentor-typing-cursor">|</span> : null}
        </h1>
      </div>
      <div className="mentor-right-panel">
        <div className="mentor-right-content">
          <h2 className="mentor-heading">
            {rightText}
            {showRightCursor ? <span className="mentor-typing-cursor">|</span> : null}
          </h2>
          <hr className="mentor-heading-divider" />
          <form className="mentor-form" onSubmit={handleSubmit}>
            <input name="fullName" type="text" placeholder="Full Name" value={mentorForm.fullName} onChange={handleChange} required />
            <input name="dob" type="date" value={mentorForm.dob} onChange={handleChange} required />

            <div className="mentor-gender-row">
              <label>
                <input type="radio" name="gender" value="Male" checked={mentorForm.gender === "Male"} onChange={handleChange} required />
                Male
              </label>
              <label>
                <input type="radio" name="gender" value="Female" checked={mentorForm.gender === "Female"} onChange={handleChange} required />
                Female
              </label>
            </div>
            
            <input name="religion" type="text" placeholder="Religion" value={mentorForm.religion} onChange={handleChange} required />
            <input name="phone" type="tel" placeholder="Phone Number" value={mentorForm.phone} onChange={handleChange} required />
            <div className="email-section" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "9px" }}>
              <div style={{ display: "flex", gap: "9px" }}>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  value={mentorForm.email} 
                  onChange={handleChange} 
                  required 
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  className="otp-trigger-btn" 
                  onClick={handleSendOtp}
                  style={{
                    padding: "0 15px",
                    borderRadius: "9px",
                    background: "rgb(37, 52, 63)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                    height: "36px",
                    transition: "all 0.2s ease"
                  }}
                >
                  {otpSent ? "Resend OTP" : "Get OTP"}
                </button>
              </div>
              
              {otpSent && (
                <div className="otp-input-wrapper" style={{ animation: "fadeIn 0.3s ease" }}>
                  <input 
                    name="otp" 
                    type="text" 
                    placeholder="Enter 6-Digit OTP" 
                    value={mentorForm.otp} 
                    onChange={handleChange} 
                    required 
                    maxLength="6"
                    style={{ 
                      width: "100%",
                      border: "2px solid #1a73e8",
                      background: "#f0f7ff",
                      height: "36px",
                      borderRadius: "9px",
                      padding: "0 10px",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                  <p style={{ fontSize: "11px", color: "#1a73e8", marginTop: "4px", marginLeft: "4px" }}>
                    OTP has been sent to your email address.
                  </p>
                </div>
              )}
            </div>
            
            <div className="input-with-suffix">
              <input
                name="teachingExperience"
                type="text"
                placeholder="Year of Teaching Experience"
                value={mentorForm.teachingExperience}
                onChange={handleChange}
                required
              />
              <span className="suffix">Yr</span>
            </div>
            
            <input
              name="specializedSubject"
              type="text"
              placeholder="Specialized In Which Subject"
              value={mentorForm.specializedSubject}
              onChange={handleChange}
              required
            />

            <textarea
              name="subjectsTaught"
              rows="2"
              placeholder="Which Subject Do You Teach?"
              value={mentorForm.subjectsTaught}
              onChange={handleChange}
              required
            />

            <div className="mentor-radio-group">
              <span className="radio-label">Are you currently teaching?</span>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="currentlyTeaching"
                    value="Yes"
                    checked={mentorForm.currentlyTeaching === "Yes"}
                    onChange={handleChange}
                    required
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="currentlyTeaching"
                    value="No"
                    checked={mentorForm.currentlyTeaching === "No"}
                    onChange={handleChange}
                    required
                  />
                  No
                </label>
              </div>
            </div>

            {mentorForm.currentlyTeaching === "Yes" && (
              <input
                name="instituteName"
                type="text"
                placeholder="In Which University/School/College"
                value={mentorForm.instituteName}
                onChange={handleChange}
                required
              />
            )}
            
            <input name="highestEducation" type="text" placeholder="Highest Education" value={mentorForm.highestEducation} onChange={handleChange} required />
            <input name="studyFromWhere" type="text" placeholder="Study from where" value={mentorForm.studyFromWhere} onChange={handleChange} required />

            <textarea
              name="description"
              rows="3"
              placeholder="Short Self Introduction"
              value={mentorForm.description}
              onChange={handleChange}
              required
            />
            
            <div className="photo-upload-section">
              <label className="photo-label">Profile Photo</label>
              <input
                ref={profilePhotoInputRef}
                className="mentor-file-input"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleChange}
                required
              />
              {previewUrl ? <img src={previewUrl} alt="Preview" className="mentor-preview-image" /> : null}
            </div>

            <button type="submit" className="mentor-submit-btn">Submit</button>
          </form>
          <div className="mentor-bottom-actions">
            <button type="button" className="mentor-reset-btn" onClick={handleReset}>
              Reset
            </button>
            <button
              type="button"
              className="mentor-back-btn"
              onClick={() => {
                window.location.href = "/Role_Page/";
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
export default MentorLogin;
