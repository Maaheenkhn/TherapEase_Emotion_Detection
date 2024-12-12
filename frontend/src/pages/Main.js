// // Dashboard.js
// import React from 'react';
// import { Link } from 'react-router-dom';  // Import Link from react-router-dom

// const Dashboard = () => {
//   return (
//     <div className="container">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card mt-5">
//             <div className="card-body">
//               <h2 className="card-title text-center mb-4">Dashboard</h2>
//               <p>Welcome to your dashboard!</p>

//               {/* Links to Login and Signup pages */}
//               <div className="mt-4 text-center">
//                 <Link to="/login" className="btn btn-primary mr-2">
//                   Go to Login
//                 </Link>
//                 <Link to="/signup" className="btn btn-secondary">
//                   Go to Signup
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css'; // Optional: Add custom styles if needed

/**
 * Main page displaying the logo and continue button.
 */
const Main = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/login'); // Navigate to the MainLogin page
  };

  return (
    <div className="main-container">
      <div className="center-box">
        <img src={require('../TherapEase_logo.png')} alt="Therapease Logo" className="logo" />
        <h1 className="app-title">THERAPEASE</h1>
      </div>
      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default Main;
