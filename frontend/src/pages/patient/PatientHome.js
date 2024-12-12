import React from 'react';
import '../../styles/patient.css'; // Import the patient-specific CSS styles

const Home = () => {
  return (
    <div className="patient-home-container">
      <div className="welcome-card">
        <h3>Welcome to the Patient Home Page!</h3>
        <p>You have successfully signed in. Enjoy your stay!</p>
      </div>
    </div>
  );
};

export default Home;
