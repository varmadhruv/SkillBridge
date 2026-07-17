import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard';
import './Dashboard.css';


const API_URL = import.meta.env.VITE_API_URL;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
