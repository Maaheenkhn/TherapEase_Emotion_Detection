import React, { useState } from 'react';

const TherapistPatientDashboard = () => {
  // State variables for MRN and patient data
  const [mrn, setMrn] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');

  // Handle MRN input change
  const handleChange = (e) => {
    setMrn(e.target.value);
  };

  // Handle form submission (fetching patient data)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mrn) {
      setError('Please enter a valid MRN');
      return;
    }

    setError('');
    
    // Mock patient data fetch logic
    // Replace with an API call or any other data fetching logic
    const mockPatientData = {
      name: 'John Doe',
      age: 35,
      mrn: mrn,
      appointments: [
        { date: '2024-01-12', time: '10:00 AM', reason: 'Follow-up' },
        { date: '2024-01-26', time: '02:00 PM', reason: 'Consultation' },
      ],
    };

    setPatientData(mockPatientData);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="card-body">
          <h2 className="card-title">Patient Dashboard</h2>
          {!patientData ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient MRN:</label>
                <input
                  type="text"
                  name="mrn"
                  value={mrn}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Patient MRN"
                />
                {error && <p className="error">{error}</p>}
              </div>
              <button type="submit" className="btn-submit">
                Search Patient
              </button>
            </form>
          ) : (
            <div className="patient-info">
              <h3>Patient Information</h3>
              <p><strong>Name:</strong> {patientData.name}</p>
              <p><strong>Age:</strong> {patientData.age}</p>
              <p><strong>MRN:</strong> {patientData.mrn}</p>

              <h3>Upcoming Appointments</h3>
              {patientData.appointments.length > 0 ? (
                <ul>
                  {patientData.appointments.map((appointment, index) => (
                    <li key={index}>
                      {appointment.date} at {appointment.time} - {appointment.reason}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming appointments.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistPatientDashboard;
