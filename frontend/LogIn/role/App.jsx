import { useState } from "react";
import "./Role.css";

function App() {
  const [selectedRole, setSelectedRole] = useState("");

  function chooseStudent() {
    setSelectedRole("Student");
    window.location.href = "/LogIn/Student_LogIn/";
  }

  function chooseMentor() {
    setSelectedRole("Mentor");
    window.location.href = "/LogIn/Mentor_LogIn/";
  }

  return (
    <main className="page">
      <div className="role-box">
        <div className="content-wrap">
          <h1>Which Role Did You Choose ?</h1>
          <p>Choose Any One role , Which Decides Further Action.</p>

          {selectedRole ? <p className="selected-role">Selected role: {selectedRole}</p> : null}

          <div className="button-row">
            <button type="button" onClick={chooseStudent} className="student-btn">
              Student
            </button>

            <button type="button" onClick={chooseMentor} className="mentor-btn">
              Mentor
            </button>
          </div>
        </div>

        <button type="button" className="role-back-btn" onClick={() => window.location.href = "/Role_Page/"}>
          Back
        </button>

        <div className="create-account-link" onClick={() => window.location.href = "/Role_Page/"}>
          Didn't Remember?, Create Account
        </div>
      </div>
    </main>
  );
}

export default App;
