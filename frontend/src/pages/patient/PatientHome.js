import React from 'react';
import '../../styles/patient.css'; // Import the patient-specific CSS styles
import QuizScene from '../../components/DigitalTwinComponent';


const Home = () => {
  return (
    <div className="threejs-container">
            <QuizScene />
    </div>
  );
};

export default Home;

