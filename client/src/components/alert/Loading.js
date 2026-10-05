import React from 'react';
import '../../styles/loading.css'; // Import the CSS file

const Loading = () => {
    return (
        <div className="loading-overlay">
            
            <svg width="65" height="65" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 33 33; 360 33 33" dur="1.2s" repeatCount="indefinite"></animateTransform>
                    <circle fill="#fff" stroke="#fff" strokeWidth="4" cx="33" cy="33" r="30" opacity="0.1"></circle>
                    <circle fill="#fff" stroke="#fff" strokeWidth="4" cx="33" cy="33" r="30" strokeDasharray="60 180" strokeLinecap="round" transform="rotate(-90 33 33)"></circle>
                </g>
            </svg>
            
            <div className="loading-text">Loading...</div>

        </div>
    );
};

export default Loading;