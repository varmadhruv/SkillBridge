import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './Consent.css';

function Consent() {
    const [isAccepted, setIsAccepted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isAccepted) {
            toast.error("Please check 'I Understand' to proceed.");
            return;
        }
        window.location.href = "../Main_Student_SignUp_Interface/index.html";
    };

    return (
        <div className="consent-container">
            <h1 className="consent-heading">Consent</h1>
            
            <div className="consent-box">
                <div className="consent-text">
                    <p>
                        I hereby declare that all the information provided by me in this student registration form is true, 
                        complete, and accurate to the best of my knowledge. I understand that any false or misleading 
                        information may result in the rejection of my registration.
                    </p>
                    <p>
                        I authorize the platform to use my academic data for project allocation and mentor communication 
                        purposes. I agree to abide by the rules and regulations of the SkillRadius platform.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="consent-footer">
                <label className="checkbox-container">
                    <input 
                        type="checkbox" 
                        checked={isAccepted} 
                        onChange={(e) => setIsAccepted(e.target.checked)} 
                        required 
                    />
                    <span>I Understand</span>
                </label>

                <button 
                    type="submit" 
                    className="consent-submit-btn"
                >
                    Agree
                </button>
            </form>
        </div>
    );
}

export default Consent;


