import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for edit and delete
import '../styles/patient.css'; // Import the CSS file for styling
import DeleteConfirmationOverlay from './DeleteConfirmationOverlay'; // Import DeleteConfirmationOverlay


const PatientComponent = ({ patientName, patientNumber, onDelete, onClick }) => {
  // State to manage whether the overlay is open
    const [isOverlayOpen, setOverlayOpen] = useState(false);
  
    // Handle click on delete button
    const handleDeleteClick = () => {
      setOverlayOpen(true); // Open the overlay
    };
  
    // Handle closing the overlay (cancel)
    const handleCloseOverlay = () => {
      setOverlayOpen(false); // Close the overlay
    };
  
    // Handle confirming the deletion (yes)
    const handleConfirmDelete = () => {
      onDelete(patientNumber); // Trigger the delete action passed from the parent
      setOverlayOpen(false); // Close the overlay after confirming
    };
  
    return (
      <div className="patient-component-container">
        <div className="patient-details">
          <div className="patient-icon"></div> {/* Placeholder for patient icon */}
          <div className="patient-info">
            <p 
              className="patient-name"
              onClick={() => onClick(patientNumber)} // Pass patientNumber instead of name
              style={{ cursor: 'pointer' }} // Make the name clickable
              >
              {patientName}
            </p>
            <p className="patient-number">{patientNumber}</p>
          </div>
        </div>
  
        <div className="icons-container">
          {/* <FaEdit className="icon edit-icon" /> */}
          <FaTrash className="icon delete-icon" onClick={handleDeleteClick} /> {/* Open overlay on delete click */}
        </div>
  
        {/* Delete Confirmation Overlay */}
        <DeleteConfirmationOverlay
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          onDelete={handleConfirmDelete}
          patientName={patientName}
          patientNumber={patientNumber}
        />
      </div>
    );
  };
  
  export default PatientComponent;
