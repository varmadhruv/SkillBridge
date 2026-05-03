import React from 'react';

const Help = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '20px' }}>Admin Support & Help</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto 40px' }}>
        Welcome to the Admin Help Center. Here you can find instructions on how to manage the SkillBridge platform.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'left' }}>
          <h3 style={{ color: '#7b2cbf' }}>Managing Mentors</h3>
          <p>Go to the Home section to verify new mentor registrations or manage existing ones.</p>
        </div>
        
        <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'left' }}>
          <h3 style={{ color: '#7b2cbf' }}>Judging Reports</h3>
          <p>Review student complaints in the Judge section. You can block mentors who violate community guidelines.</p>
        </div>
        
        <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'left' }}>
          <h3 style={{ color: '#7b2cbf' }}>System Rules</h3>
          <p>Refer to the Rules section for the standard operating procedures of the platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
