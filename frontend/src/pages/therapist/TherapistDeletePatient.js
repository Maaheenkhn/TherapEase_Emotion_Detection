import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/therapist.css'; // Reusing styles

/**
 * Therapist page to delete a patient.
 */
const TherapistDeletePatient = () => {
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPatientId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      setError('Please enter a valid Patient ID.');
      return;
    }

    setError(''); // Clear any previous errors

    try {
      // Placeholder for API call to delete a patient
      // Assuming there is an API endpoint for deleting a patient
      const response = await fetch(`/api/patient/delete/${patientId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/therapist/home'); // Redirect after successful deletion
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('An error occurred while deleting the patient.');
    }
  };

  return (
    <div className="delete-container">
      <div className="delete-card">
        <div className="card-body">
          <h2 className="card-title">Delete Patient</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Patient ID:</label>
              <input
                type="text"
                name="patientId"
                value={patientId}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter Patient ID"
              />
              {error && <p className="error">{error}</p>}
            </div>

            <button type="submit" className="btn-submit">
              Delete Patient
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TherapistDeletePatient;
