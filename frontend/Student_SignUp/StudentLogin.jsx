import "./Student_Login.css";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

function StudentLogin() {
  const [typedGreeting, setTypedGreeting] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const studentPhotoInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    religion: "",
    motherTongue: "",
    universityPRN: "",
    motherName: "",
    university: "",
    collegeName: "",
    course: "",
    academicYear: "",
    contact: "",
    email: "",
    stateCity: "",
    studentPhoto: null,
    otp: ""
  });
  const [expectedOtp, setExpectedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "studentPhoto") {
      const selectedFile = files?.[0] || null;
      if (selectedFile) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl("");
      }
      setFormData(prev => ({
        ...prev,
        [name]: selectedFile
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/send-registration-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() }),
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

  const submitStudentRegistration = async (formDataToSend) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/student-registration', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Registration Successful! ✅');
        localStorage.setItem("studentEmail", formData.email);
        window.location.href = "/Student_SignUp/Student_Consent/index.html";
      } else if (response.status === 409) {
        toast.error("User already exists!");
      } else {
        toast.error(result.message || "Registration failed!");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Connection error. Try again.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const [statePart = "", cityPart = ""] = formData.stateCity.split("/").map((value) => value.trim());
    const state = statePart || formData.stateCity.trim();
    const city = cityPart || formData.stateCity.trim();

    // OTP Verification
    if (!otpSent || !expectedOtp) {
      toast.error("Please verify your email with OTP first!");
      return;
    }

    if (formData.otp !== expectedOtp) {
      toast.error("Invalid OTP! Please check and try again.");
      return;
    }

    // Validations
    if (!/^\d{10}$/.test(formData.contact)) {
      toast.error("Invalid 10-digit contact!");
      return;
    }

    if (!/^\d{12}$/.test(formData.universityPRN)) {
      toast.error("Invalid 12-digit PRN!");
      return;
    }

    if (!formData.studentPhoto) {
      toast.error("Please upload a photo!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName.trim());
    formDataToSend.append("dateOfBirth", formData.dateOfBirth.trim());
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("religion", formData.religion.trim());
    formDataToSend.append("motherTongue", formData.motherTongue.trim());
    formDataToSend.append("universityPRN", formData.universityPRN.trim());
    formDataToSend.append("motherName", formData.motherName.trim());
    formDataToSend.append("university", formData.university.trim());
    formDataToSend.append("collegeName", formData.collegeName.trim());
    formDataToSend.append("course", formData.course.trim());
    formDataToSend.append("year", formData.academicYear.trim());
    formDataToSend.append("contact", formData.contact.trim());
    formDataToSend.append("email", formData.email.trim().toLowerCase());
    formDataToSend.append("state", state);
    formDataToSend.append("city", city);
    formDataToSend.append("weakSubject", "N/A");
    formDataToSend.append("studentPhoto", formData.studentPhoto);

    try {
      const checkResponse = await fetch('http://127.0.0.1:5000/check-student-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          universityPRN: formData.universityPRN,
          contact: formData.contact
        }),
      });

      if (checkResponse.status === 409) {
        toast.error("User already exists!");
        return;
      }
    } catch (error) {
      console.error('Validation check error:', error);
      toast.error('Server error during validation.');
      return;
    }

    await submitStudentRegistration(formDataToSend);
  };

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
    const secondWord = getIndiaGreeting();
    const timeoutIds = [];

    const schedule = (callback, delay) => {
      const id = setTimeout(callback, delay);
      timeoutIds.push(id);
    };

    const typeText = (text, index = 0) => {
      if (index <= text.length) {
        setTypedGreeting(text.slice(0, index));
        schedule(() => typeText(text, index + 1), 110);
      } else if (text === secondWord) {
        setShowCursor(false);
      }
    };

    const backspaceText = (text, index = text.length) => {
      if (index >= 0) {
        setTypedGreeting(text.slice(0, index));
        schedule(() => backspaceText(text, index - 1), 70);
      } else {
        schedule(() => typeText(secondWord), 250);
      }
    };

    setShowCursor(true);
    typeText(firstWord);
    schedule(() => backspaceText(firstWord), firstWord.length * 110 + 3000);

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);


  return (
    <main className="student-page">
      <div className="left-panel">
        <div className="left-panel-content">
          <h1 className="greeting-text">
            {typedGreeting}
            {showCursor ? <span className="typing-cursor">|</span> : null}
          </h1>
        </div>
      </div>
      <div className="right-panel">
        <div className="form-card">
          <h2 className="right-panel-title">Student Information</h2>
          <hr className="welcome-divider" />
          <form className="student-form" onSubmit={handleSubmit}>
            <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
            
            <input name="religion" type="text" placeholder="Religion" value={formData.religion} onChange={handleChange} required />
            <input name="motherTongue" type="text" placeholder="Mother Tongue" value={formData.motherTongue} onChange={handleChange} required />

            <div className="gender-row">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  required
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  required
                />
                Female
              </label>
            </div>

            <input name="university" type="text" placeholder="University Name" value={formData.university} onChange={handleChange} required />
            <input name="collegeName" type="text" placeholder="College Name" value={formData.collegeName} onChange={handleChange} required />
            
            <input name="universityPRN" type="text" placeholder="University PRN Number" value={formData.universityPRN} onChange={handleChange} required />
            <input name="motherName" type="text" placeholder="Mother Name" value={formData.motherName} onChange={handleChange} required />
            
            <input name="course" type="text" placeholder="Pursuing Course" value={formData.course} onChange={handleChange} required />
            <input
              name="academicYear"
              type="text"
              placeholder="Academic Year"
              value={formData.academicYear}
              onChange={handleChange}
              required
            />
            <input name="contact" type="tel" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
            
            <input name="stateCity" type="text" placeholder="State/City (use / between them)" value={formData.stateCity} onChange={handleChange} required />
            
            <div className="email-section" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "9px" }}>
              <div style={{ display: "flex", gap: "9px" }}>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email ID" 
                  value={formData.email} 
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
                    value={formData.otp} 
                    onChange={handleChange} 
                    required 
                    maxLength="6"
                    style={{ 
                      width: "100%",
                      border: "2px solid #1a73e8",
                      background: "#f0f7ff"
                    }}
                  />
                  <p style={{ fontSize: "11px", color: "#1a73e8", marginTop: "4px", marginLeft: "4px" }}>
                    OTP has been sent to your email address.
                  </p>
                </div>
              )}
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "rgb(37, 52, 63)" }}>Student Photo</label>
              <input
                ref={studentPhotoInputRef}
                name="studentPhoto"
                type="file"
                accept="image/*"
                onChange={handleChange}
                required
              />
              {previewUrl && (
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <img src={previewUrl} alt="Preview" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgb(37, 52, 63)" }} />
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn">Submit</button>
          </form>

          <button type="button" className="back-btn" onClick={() => { window.location.href = "/Role_Page/"; }}>
            Back
          </button>
        </div>
      </div>
    </main>
  );
}

export default StudentLogin;
