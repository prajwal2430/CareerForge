import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  const containerStyle = fullScreen ? { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {};
  return (
    <div className="spinner-container" style={containerStyle}>
      <div className="spinner"></div>
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
