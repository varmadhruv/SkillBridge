import React from "react";
import ReactDOM from "react-dom/client";

function BlockPage() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: 'red', fontSize: '2.5rem', marginBottom: '1rem' }}>
        User Blocked Due to Some Reason
      </h1>
      <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
        Please contact administration for more information.
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          marginTop: '2rem',
          padding: '10px 20px',
          backgroundColor: '#1e293b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Go Back Home
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BlockPage />
  </React.StrictMode>
);
