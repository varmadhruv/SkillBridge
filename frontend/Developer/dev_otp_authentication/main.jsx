const API_URL = import.meta.env.VITE_API_URL;
import React from 'react'
import ReactDOM from 'react-dom/client'
import Otp_Auth from './Otp_Auth'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Otp_Auth />
  </React.StrictMode>,
)
