const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import React from 'react'
import ReactDOM from 'react-dom/client'
import DiveIn from './DiveIn'
import './DiveIn.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DiveIn />
  </React.StrictMode>,
)
