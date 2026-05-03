import React from 'react';
import './Contact_Dev.css';

const Contact_Dev = () => {
  return (
    <div className="contact-dev-wrapper">
      <div className="dev-card">
        <div className="dev-header">
          <div className="dev-avatar">DV</div>
          <div className="dev-main-info">
            <h2 className="dev-name">Dhruv Varma</h2>
            <span className="dev-role">Lead Developer & Architect</span>
          </div>
        </div>
        
        <div className="dev-body">
          <p className="dev-bio">
            Passionate about building scalable systems and intuitive user experiences. 
            Guardian of the SkillBridge codebase.
          </p>
          
          <div className="contact-actions">
            <a href="mailto:dhruvvarma53@gmail.com" className="contact-btn email">
              <span className="btn-icon">📧</span>
              Email Me
            </a>
          </div>
        </div>
        
        <div className="dev-footer">
          <span className="availability">● Available for critical fixes</span>
        </div>
      </div>
    </div>
  );
};

export default Contact_Dev;
