import React, { useState, useEffect } from "react";
import "./Home.css";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Feedback from "./Feedback";
import Help from "./Help";
import Home_Section from "./Home_Section/Home_Section";
import Report_Mentor from "./Report_Mentor/Report_Mentor";


function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  const [studentName, setStudentName] = useState(localStorage.getItem("studentFullName") || "Student");
  const [studentId, setStudentId] = useState(() => {
    const id = localStorage.getItem("studentId");
    return (id && id !== "undefined" && id !== "null") ? id : "";
  });

  const navItems = [
    "Home",
    "About Us",
    "Contact Us",
    "Report Mentor",
    "My Account",
    "FeedBack",
    "Help"
  ];

  const handleNavClick = (item) => {
    if (["Home", "About Us", "Contact Us", "FeedBack", "Help", "My Account", "Report Mentor"].includes(item)) {
      setActiveTab(item);
    }
  };

  const [studentData, setStudentData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // Sync ID from localStorage in case it changed
    const storedId = localStorage.getItem("studentId");
    const validId = (storedId && storedId !== "undefined" && storedId !== "null") ? storedId : "";
    if (validId && validId !== studentId) {
      setStudentId(validId);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "My Account" && studentId && !studentData) {
      console.log("Fetching student data for ID:", studentId);
      fetch(`http://127.0.0.1:5000/student-record/${studentId}`)
        .then(res => {
          if (!res.ok) throw new Error(`Server returned ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log("Fetched data:", data);
          if (data.data) {
            setStudentData(data.data);
            setFetchError(null);
          } else {
            setFetchError("No data found in response");
          }
        })
        .catch(err => {
          console.error("Error fetching student data:", err);
          setFetchError(`${err.message}. Check if backend is running on port 5000.`);
        });
    }
  }, [activeTab, studentId, studentData]);

  const renderContent = () => {
    switch (activeTab) {
      case "About Us":
        return <AboutUs studentName={studentName} />;
      case "Contact Us":
        return <ContactUs />;
      case "FeedBack":
        return <Feedback studentId={studentId} studentName={studentName} />;
      case "Help":
        return <Help />;
      case "Report Mentor":
        return <Report_Mentor />;
      case "My Account":
        return (
          <div className="section-container">
            <div className="account-outer-div">
              <div className="profile-image-container">
                {studentData?.photoUrl ? (
                  <img src={studentData.photoUrl} alt="Profile" className="profile-image-subdiv" />
                ) : (
                  <div className="profile-image-subdiv placeholder">No Photo</div>
                )}
              </div>
              
              <div className="account-details-list">
                {studentData ? (
                  <>
                    <div className="detail-item">
                      <p className="detail-label">Student Name :-</p>
                      <p className="detail-value">{studentData.fullName}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Gender :-</p>
                      <p className="detail-value">{studentData.gender}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Email ID :-</p>
                      <p className="detail-value">{studentData.email}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Contact No :-</p>
                      <p className="detail-value">{studentData.contact}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">University PRN :-</p>
                      <p className="detail-value">{studentData.universityPRN}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">University :-</p>
                      <p className="detail-value">{studentData.university}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">College Name :-</p>
                      <p className="detail-value">{studentData.collegeName}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Course :-</p>
                      <p className="detail-value">{studentData.course}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Year :-</p>
                      <p className="detail-value">{studentData.year}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Weak Subject :-</p>
                      <p className="detail-value">{studentData.weakSubject}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Mother's Name :-</p>
                      <p className="detail-value">{studentData.motherName}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Religion :-</p>
                      <p className="detail-value">{studentData.religion}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Mother Tongue :-</p>
                      <p className="detail-value">{studentData.motherTongue}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">State :-</p>
                      <p className="detail-value">{studentData.state}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">City :-</p>
                      <p className="detail-value">{studentData.city}</p>
                    </div>
                  </>
                ) : fetchError ? (
                  <div className="error-message">
                    <p>Error: {fetchError}</p>
                    <button className="action-btn" onClick={() => { setStudentData(null); setFetchError(null); }}>Retry</button>
                  </div>
                ) : (
                  <p>Loading details...</p>
                )}
              </div>
            </div>
          </div>
        );
      case "Home":
      default:
        return <Home_Section />;


    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setActiveTab("Home")}>SkillBridge</div>
        <ul className="nav-links">
          {navItems.map((item, index) => (
            <li 
              key={index} 
              className={activeTab === item ? "nav-item-active" : ""}
              onClick={() => handleNavClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
      
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default Home;


