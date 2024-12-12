// import React from 'react';

// const Home = () => {
//   return (
//     <div className="container">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card mt-5">
//             <div className="card-body">
//               <h3 className="card-title text-center">Welcome to the Therapist Home Page!</h3>
//               <p className="text-center">You have successfully signed in. Enjoy your stay!</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/therapist.css'; // Import the therapist-specific CSS styles

const TherapistHome = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="therapist-home-container">
      <h1 className="text-center mt-4">Therapist Home</h1>

      <div className="options-container mt-5">
        {/* View Patient Section */}
        <div className="option-card">
          <h3>View Patient</h3>
          <p>Search and view details of registered patients.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/therapist/patient-dashboard')}
          >
            Go to View Patient
          </button>
        </div>

        {/* Delete Patient Section */}
        <div className="option-card">
          <h3>Delete Patient</h3>
          <p>Remove a patient's record from the system.</p>
          <button
            className="btn btn-danger"
            onClick={() => navigate('/therapist/delete-patient')}
          >
            Go to Delete Patient
          </button>
        </div>

        {/* Add New Patient Section */}
        <div className="option-card">
          <h3>Add New Patient</h3>
          <p>Register a new patient into the system.</p>
          <button
            className="btn btn-success"
            onClick={() => navigate('/therapist/add-patient')}
          >
            Go to Add Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistHome;
