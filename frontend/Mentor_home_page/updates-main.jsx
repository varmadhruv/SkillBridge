const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import ReactDOM from 'react-dom/client'
import Updates from './Updates'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Updates />
)
