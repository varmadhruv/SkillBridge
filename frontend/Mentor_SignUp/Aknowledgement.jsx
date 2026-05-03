import "./Aknowledgement.css";
import { useState } from "react";

function Aknowledgement() {
  const [isUnderstood, setIsUnderstood] = useState(false);

  return (
    <main className="mentor-ack-page">
      <div className="mentor-ack-card">
        <h1>Declaration</h1>
        <p>
          I hereby declare that all the information provided by me in this registration form, including my personal
          details, contact information, teaching experience, qualifications, and uploaded photograph, is true,
          complete, and accurate to the best of my knowledge.
        </p>
        <p>
          I confirm that I have personally filled in all the details and have not provided any false or misleading
          information.
        </p>
        <p>
          I further give my consent to SkillRadius to store, process, and use my provided information and photograph
          for platform-related purposes, including but not limited to profile display, student interaction, and
          academic assistance services.
        </p>
        <p>
          I understand that any incorrect or false information may lead to the rejection of my registration or removal
          from the platform.
        </p>
        <p>By proceeding, I agree to the terms and conditions of SkillRadius.</p>

        <div className="mentor-ack-actions">
          <label className="mentor-ack-check">
            <input
              type="checkbox"
              checked={isUnderstood}
              onChange={(event) => setIsUnderstood(event.target.checked)}
            />
            I Understand
          </label>

          <button
            type="button"
            className="mentor-ack-btn"
            disabled={!isUnderstood}
            onClick={() => {
              window.location.href = "/Mentor_Main_SignUp_Interface/";
            }}
          >
            Got It
          </button>
        </div>
      </div>
    </main>
  );
}

export default Aknowledgement;
