import React, { useState } from "react";
import toast from "react-hot-toast";
import "./StudentMainLogin.css";

function StudentMainLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const email = localStorage.getItem("studentEmail");
    
    if (!email) {
      toast.error("Student email not found! Please register again.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/student-main-login", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Credentials Updated Successfully! ✅");
        setTimeout(() => {
          window.location.href = "/Student_Home_page/index.html";
        }, 1500);
      } else {
        toast.error(`Update Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating credentials:", error);
      toast.error("Error occurred while updating. Please try again.");
    }
  };

  const handleReset = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <div className="signup-container">
      <div className="skillbridge-brand">SkillBridge</div>
      <h1 className="signup-title">SignUp</h1>
      
      <form className="signup-form" onSubmit={handleUpdate}>
        <div className="input-group">
          <input
            type="text"
            className="input-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span 
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </span>
          </div>
        </div>
        
        <div className="button-container">
          <button type="button" className="action-btn reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="action-btn update-btn">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentMainLogin;
