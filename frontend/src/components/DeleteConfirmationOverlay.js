import React from 'react';
import '../styles/deleteoverlay.css';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importing the warning icon

const DeleteConfirmationOverlay = ({ isOpen, onClose, onDelete, patientName, patientNumber }) => {
    return (
      <div className={`overlay ${isOpen ? 'open' : ''}`}>
        <div className="overlay-content">
          {/* Warning Icon */}
          <FaExclamationTriangle className="warning-icon" />
  
          <h2>Are you sure?</h2>
          <p>This action will permanently delete {patientName}'s data. This cannot be undone.</p>
  
          {/* Button Container for Cancel and Delete Buttons */}
          <div className="button-container">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="confirm-btn" onClick={() => onDelete(patientNumber)}>Delete</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteConfirmationOverlay;

