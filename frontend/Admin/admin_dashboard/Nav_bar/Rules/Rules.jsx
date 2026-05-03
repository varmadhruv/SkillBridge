import React from 'react';
import './Rules.css';

function Rules() {
  return (
    <div className="rules-wrapper">
      <div className="rules-header">
        <h1 className="rules-title">Rules Book</h1>
        <p className="rules-subtitle">Guidelines & Authority for SkillBridge Administrators</p>
      </div>

      <div className="rules-grid">
        <div className="rule-card">
          <div className="rule-icon-box">🛡️</div>
          <h3>Admin Responsibilities</h3>
          <p>
            The Admin is responsible for reviewing and verifying every mentor on the platform. 
            Thoroughly check all submitted information before marking as <strong>verified</strong>.
          </p>
        </div>

        <div className="rule-card">
          <div className="rule-icon-box">⚡</div>
          <h3>Account Control</h3>
          <p>
            The Admin holds full authority over mentor accounts. This includes the right to 
            suspend, delete, or enforce a strict ban if misconduct is detected.
          </p>
        </div>

        <div className="rule-card">
          <div className="rule-icon-box">🚫</div>
          <h3>Misconduct & Violations</h3>
          <p>
            Unethical activities like account sharing or misuse will result in immediate action: 
            halting commissions, suspending access, and permanent banning.
          </p>
        </div>

        <div className="rule-card">
          <div className="rule-icon-box">⚖️</div>
          <h3>Accountability</h3>
          <p>
            Act with due diligence and fairness. Failure in proper verification or handling 
            violations reflects on the Admin's accountability and platform integrity.
          </p>
        </div>
      </div>
      
      <div className="rules-footer">
        <p>Guardian of SkillBridge Integrity</p>
      </div>
    </div>
  );
}

export default Rules;
