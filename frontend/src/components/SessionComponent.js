import React from 'react';
import '../styles/therapist.css'; // Import the CSS file for styling

const SessionComponent = ({ sessionNumber, sessionID, totalCorrect, avgProgressScore, patientName, patientNumber }) => {
  return (
    <div className="session-component-container">
        <div className="session-info">
          <p className="session-name">{`Session # ${sessionNumber}`}</p>
          <p className="session-total-correct">{`${totalCorrect} / 10`}</p>
          <p className="session-avg-progress">{`${avgProgressScore}`}</p>
        </div>
      </div>
  );
};

export default SessionComponent;
