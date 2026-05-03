import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Navbar from './Nav_bar/Navbar';
import Home from './Nav_bar/Home/Home';
import Rules from './Nav_bar/Rules/Rules';
import Myaccount from './Nav_bar/Myaccount/Myaccount';
import Contact_Dev from './Nav_bar/Contact_Dev/Contact_Dev';
import Judge from './Nav_bar/Judge/Judge';
import Help from './Nav_bar/Help/Help';

function Dashboard() {
  const [adminName, setAdminName] = useState('');
  const [currentTab, setCurrentTab] = useState('home');

  useEffect(() => {
    // Check if admin is logged in
    const storedName = localStorage.getItem('AdminName');
    const storedId = localStorage.getItem('adminId');

    if (!storedName || !storedId) {
      // Redirect to login if not authenticated
      window.location.href = '/Admin/Login/index.html';
    } else {
      setAdminName(storedName);
    }

    // Handle hash change for navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentTab(hash);
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'home': return <Home />;
      case 'my-account': return <Myaccount />;
      case 'rules': return <Rules />;
      case 'contact-dev': return <Contact_Dev />;
      case 'judge': return <Judge />;
      case 'help': return <Help />;
      default: return <Home />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
