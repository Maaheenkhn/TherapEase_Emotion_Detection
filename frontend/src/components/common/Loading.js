import React from 'react';
// import './loading.css'; // Import styles for loading animation

/**
 * Loading component for displaying a spinner or loading indicator.
 */
const Loading = () => {
  return (
    <div className="loading">
      <div className="loading__spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
