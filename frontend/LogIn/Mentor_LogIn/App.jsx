import React, { useEffect, useRef, useState } from 'react';
import TypeIt from "typeit";
import toast from 'react-hot-toast';
import './Login.css';

function App() {
    const typeItRef = useRef(null);
    const animated = useRef(false);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (animated.current) return;
        animated.current = true;

        const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return "Good Morning";
            if (hour < 17) return "Good Afternoon";
            return "Good Evening";
        };

        const greeting = getGreeting();

        let instance;
        if (typeItRef.current) {
            typeItRef.current.innerHTML = ""; 
            instance = new TypeIt(typeItRef.current, {
                speed: 50,
                waitUntilVisible: true,
                cursor: false,
            })
            .type(greeting)
            .pause(1000)
            .delete()
            .type("Welcome ! Back")
            .go();
        }

        return () => {
            if (instance) {
                instance.destroy();
            }
        };
    }, []);

    const handleLogin = async () => {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        const trimmedEmail = email.trim();

        if (!trimmedUsername || !trimmedPassword || !trimmedEmail) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/mentor-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: trimmedUsername,
                    password: trimmedPassword,
                    email: trimmedEmail
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message); 
                
                // Save to localStorage
                localStorage.setItem("mentorId", data.mentorId);
                localStorage.setItem("mentorFullName", data.fullName);
                if (data.photoUrl) {
                    localStorage.setItem("mentorPhotoUrl", data.photoUrl);
                }
                localStorage.setItem("tempOtp", data.otp);
                localStorage.setItem("tempEmail", trimmedEmail);
                
                // Redirect after toast
                setTimeout(() => {
                    window.location.href = "/mentor_otp_authentication/index.html";
                }, 1000);
            } else if (response.status === 403 && data.message === "blocked") {
                toast.error("User Blocked Due to Some Reason");
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1500);
            } else {
                toast.error(data.message); 
            }
        } catch (error) {
            toast.error("Login failed. Server might be down.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="branding">SkillBridge</div>
                
                <div className="login-content">
                    <h1 ref={typeItRef}></h1>
                    <p className="subtitle">Enter Required Credentials to Continue</p>
                    
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="UserName" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box' }}
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
                        <input 
                            type="email" 
                            placeholder="Register EmailId" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '8px' }}>
                        <span
                            onClick={() => window.location.href = '/forgot_mentor_password/index.html'}
                            style={{ fontSize: '0.8rem', color: '#1565c0', cursor: 'pointer', fontWeight: '500', textDecoration: 'underline' }}
                        >
                            Forgot Password?
                        </span>
                    </div>
                    
                    <div className="button-group">
                        <button className="login-btn" onClick={handleLogin}>LogIn</button>
                        <button className="back-btn" onClick={() => window.location.href = "/LogIn/role/"}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
