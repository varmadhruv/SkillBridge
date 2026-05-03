import { useState } from "react";
import "./Role_Page.css";

function App() {
  const [selectedRole, setSelectedRole] = useState("");

  function chooseStudent() {
    setSelectedRole("Student");
    window.location.href = "/Student_SignUp/";
  }

  function chooseMentor() {
    setSelectedRole("Mentor");
    window.location.href = "/Mentor_SignUp/";
  }

  return (
    <main className="page">
      <div className="role-box">
        <div className="content-wrap">
          <h1>Choose Which Role Fits You</h1>
          <p>Choose Any One role , Which Decides Further Action.</p>

          {selectedRole ? <p className="selected-role">Selected role: {selectedRole}</p> : null}

          <div className="button-row">
            <button type="button" onClick={chooseStudent} className="student-btn">
              Student?
            </button>

            <button type="button" onClick={chooseMentor} className="mentor-btn">
              Mentor?
            </button>
          </div>
          
        </div>

        <button type="button" className="role-back-btn" onClick={() => window.location.href = "/Dive_in/index.html"}>
          Back
        </button>

        <div className="login-redirect" onClick={() => window.location.href = "/LogIn/role/"}>
          You already have an account. LogIn ?
        </div>
      </div>
    </main>
  );
}

export default App;
