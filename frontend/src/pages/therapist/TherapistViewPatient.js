// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// const TherapistViewPatient = () => {
//   const [mrno, setMrno] = useState(''); // State for storing MRNO input
//   const [error, setError] = useState(null); // State for handling errors
//   const navigate = useNavigate(); // Hook for navigation

//   const handleChange = (e) => {
//     setMrno(e.target.value); // Update MRNO state on input change
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent default form submission

//     // Basic validation to check if MRNO is entered
//     if (!mrno) {
//       setError('Please enter the Patient MRNO.');
//       return;
//     }

//     // Clear the error state if MRNO is valid
//     setError(null);

//     // Navigate to the Patient Dashboard with the MRNO as a parameter
//     // navigate(`/patient-dashboard/${mrno}`);

//     navigate(`/therapist/patient-dashboard`);
//   };

//   return (
//     <div className="view-patient-container">
//       <div className="view-patient-card">
//         <div className="card-body">
//           <h2 className="card-title">View Patient</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Patient MRNO:</label>
//               <input
//                 type="text"
//                 name="mrno"
//                 value={mrno}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="Enter Patient MRNO"
//               />
//               {error && <p className="error">{error}</p>}
//             </div>

//             <button type="submit" className="btn-submit">
//               View Patient
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TherapistViewPatient;
