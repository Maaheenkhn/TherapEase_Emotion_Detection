
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import profileImage from '../../profile.png';  // Adjust path accordingly
import '../../styles/therapist.css'; // Import the therapist-specific CSS styles
import { FaEdit } from "react-icons/fa"; // Import the FaEdit icon
import { jwtDecode as jwt_decode } from 'jwt-decode';


const TherapistHome = () => {
  const navigate = useNavigate(); // Hook for navigation
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = new Date().getDay(); // Returns 0 for Sunday, 1 for Monday, etc.
  const dayName = daysOfWeek[currentDay]; // Get the day name (e.g., Monday, Tuesday)



  const token = localStorage.getItem('token');  // You may have stored it differently
  const decodedToken = jwt_decode(token);
  const therapistName= decodedToken.sub.name;  // Assuming 'email' is a property in the JWT
  
  const handleEditClick = () => {
    navigate('/therapist/profile'); // Navigate to the profile page when the button is clicked
  };

  return (
    <div className="therapist-home-container">

      <Navbar />
      <div style={{ width: '400px' }}></div>

      <div className="therapist-home">

        {/* Therapist Name Card */}
        <div className="therapist-name-card">
          <h1>Welcome, {therapistName}</h1>
          <h2>Have a nice {dayName}</h2>
        </div>

        {/* Therapist Profile Card */}
        <div className="therapist-profile-card">
          <div className="profile-header">
            <h3>My Profile</h3>
            {/* Edit button with FaEdit icon */}
            <button className="edit-button" onClick={handleEditClick}>
              <FaEdit aria-hidden="true" />
            </button>
          </div>
          <div className="profile-details">
            <img
              src={profileImage}
              alt="Therapist Profile"
              className="profile-pic"
            />
            <p className="therapist-name">{therapistName}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TherapistHome;



// return (
//   <div className="therapist-home-container">
//     <h1 className="text-center mt-4">Therapist Home</h1>

//     <div className="options-container mt-5">
//       {/* View Patient Section */}
//       <div className="option-card">
//         <h3>View Patient</h3>
//         <p>Search and view details of registered patients.</p>
//         <button
//           className="btn btn-primary"
//           onClick={() => navigate('/therapist/patient-dashboard')}
//         >
//           Go to View Patient
//         </button>
//       </div>

//       {/* Delete Patient Section */}
//       <div className="option-card">
//         <h3>Delete Patient</h3>
//         <p>Remove a patient's record from the system.</p>
//         <button
//           className="btn btn-danger"
//           onClick={() => navigate('/therapist/delete-patient')}
//         >
//           Go to Delete Patient
//         </button>
//       </div>

//       {/* Add New Patient Section */}
//       <div className="option-card">
//         <h3>Add New Patient</h3>
//         <p>Register a new patient into the system.</p>
//         <button
//           className="btn btn-success"
//           onClick={() => navigate('/therapist/add-patient')}
//         >
//           Go to Add Patient
//         </button>
//       </div>
//     </div>
//   </div>
// );
