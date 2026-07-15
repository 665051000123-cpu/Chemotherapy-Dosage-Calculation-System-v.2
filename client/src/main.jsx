import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Prevent scrolling and arrow keys from changing number inputs globally
document.addEventListener('wheel', function(event) {
    if (document.activeElement.type === 'number') {
        document.activeElement.blur();
    }
});

document.addEventListener('keydown', function(event) {
    if (document.activeElement.type === 'number') {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
