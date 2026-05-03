import "./Main_Login.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function MainLogin() {
  const [fullName, setFullName] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [mentorUsername, setMentorUsername] = useState("");
  const [mentorPassword, setMentorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNameReady, setIsNameReady] = useState(false);

  const isValidObjectId = (value) => /^[a-f\d]{24}$/i.test(String(value || "").trim());

  const resolveMentorId = async (nameCandidate) => {
    const storedId = (localStorage.getItem("mentorId") || "").trim();
    if (isValidObjectId(storedId)) {
      return storedId;
    }
    if (storedId) {
      localStorage.removeItem("mentorId");
    }

    try {
      const recordsResponse = await fetch("http://127.0.0.1:5000/mentor-records");
      const recordsData = await recordsResponse.json();
      const mentors = Array.isArray(recordsData?.data) ? recordsData.data : [];
      const normalizedName = (nameCandidate || "").trim().toLowerCase();

      const matchedMentor = mentors.find((mentor) => {
        return String(mentor?.fullName || "").trim().toLowerCase() === normalizedName;
      });

      const fallbackMentor = matchedMentor || mentors[0];
      if (fallbackMentor?._id) {
        localStorage.setItem("mentorId", fallbackMentor._id);
        return fallbackMentor._id;
      }
    } catch (_error) {
      return "";
    }

    return "";
  };

  const isUsernameTaken = async (usernameCandidate, currentMentorId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/mentor-records");
      const data = await response.json();
      const mentors = Array.isArray(data?.data) ? data.data : [];
      const normalizedUsername = String(usernameCandidate || "").trim().toLowerCase();

      return mentors.some((mentor) => {
        const existingUsername = String(mentor?.mentorUsername || "").trim().toLowerCase();
        const existingMentorId = String(mentor?._id || "").trim();
        return existingUsername && existingUsername === normalizedUsername && existingMentorId !== currentMentorId;
      });
    } catch (_error) {
      return false;
    }
  };

  useEffect(() => {
    const savedMentorId = (localStorage.getItem("mentorId") || "").trim();
    const normalizedMentorId = isValidObjectId(savedMentorId) ? savedMentorId : "";
    const cachedName = localStorage.getItem("mentorFullName") || "";
    setMentorId(normalizedMentorId);

    if (!normalizedMentorId) {
      setFullName(cachedName);
      setIsNameReady(true);
      return;
    }

    const fetchMentor = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/mentor-record/${normalizedMentorId}`);
        const data = await response.json();

        if (!response.ok) {
          setFullName(cachedName);
          return;
        }

        const resolvedName = data?.data?.fullName || cachedName;
        setFullName(resolvedName);
        setMentorUsername(data?.data?.mentorUsername || "");
        setMentorPassword(data?.data?.mentorPassword || "");

        if (resolvedName) {
          localStorage.setItem("mentorFullName", resolvedName);
        }
      } catch (_error) {
        setFullName(cachedName);
      } finally {
        setIsNameReady(true);
      }
    };

    fetchMentor();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!mentorUsername.trim() || !mentorPassword.trim()) {
      toast.error("Username aur Password dono bharna zaroori hai.");
      return;
    }

    setIsSaving(true);
    try {
      const resolvedId = isValidObjectId(mentorId) ? mentorId : await resolveMentorId(fullName);
      if (!resolvedId) {
        toast.error("Mentor ID nahi mila. Pehle registration complete karo.");
        return;
      }

      setMentorId(resolvedId);
      const usernameAlreadyExists = await isUsernameTaken(mentorUsername, resolvedId);
      if (usernameAlreadyExists) {
        toast.error("Username exists");
        return;
      }

      const saveCredentials = async (targetId) =>
        fetch(`http://127.0.0.1:5000/mentor-main-login/${targetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mentorUsername: mentorUsername.trim(),
            mentorPassword: mentorPassword.trim()
          })
        });
      let response = await saveCredentials(resolvedId);

      const parseResponse = async (serverResponse) => {
        const raw = await serverResponse.text();
        try {
          return raw ? JSON.parse(raw) : {};
        } catch (_parseError) {
          return {};
        }
      };

      let data = await parseResponse(response);

      if (!response.ok) {
        const retryId = await resolveMentorId(fullName);
        if (retryId && retryId !== resolvedId) {
          setMentorId(retryId);
          response = await saveCredentials(retryId);
          data = await parseResponse(response);
        }
      }

      if (!response.ok) {
        toast.error(data?.message || "Details save nahi ho paaye.");
        return;
      }

      toast.success("Username aur password same mentor id me save ho gaye.");
      window.location.href = "/Mentor_home_page/";
    } catch (_error) {
      toast.error("Server connection issue. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setMentorUsername("");
    setMentorPassword("");
  };

  return (
    <main className="main-login-page">
      <div className="main-login-card">
        <div className="skillbridge-logo">SkillBridge</div>
        <h1 className="signup-title">SignUp</h1>
        <p className="signup-subtext">Get started with SkillBridge</p>
        
        <form className="main-login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="mentorUsername">UserName</label>
            <input
              id="mentorUsername"
              type="text"
              value={mentorUsername}
              onChange={(event) => setMentorUsername(event.target.value)}
              placeholder="Enter UserName"
            />
          </div>

          <div className="input-group">
            <label htmlFor="mentorPassword">Password</label>
            <div className="password-input-wrapper" style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                id="mentorPassword"
                type={showPassword ? "text" : "password"}
                value={mentorPassword}
                onChange={(event) => setMentorPassword(event.target.value)}
                placeholder="Enter Password"
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", cursor: "pointer", color: "#666", display: "flex", alignItems: "center" }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div className="main-login-actions">
            <button type="button" className="main-login-reset-btn" onClick={handleReset} disabled={isSaving}>
              Reset
            </button>
            <button type="submit" className="main-login-update-btn" disabled={isSaving}>
              {isSaving ? "Starting..." : "Get Start !"}
            </button>
          </div>
        </form>
      </div>
    </main>

  );
}

export default MainLogin;
