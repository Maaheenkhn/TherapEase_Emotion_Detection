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



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/main.css'; // Optional: Add custom styles if needed
// import Header from '../components/Header'; // Import Header

// /**
//  * Main page displaying the logo and continue button.
//  */
// const Main = () => {
//   const navigate = useNavigate();

//   const handleContinue = () => {
//     navigate('/login'); // Navigate to the MainLogin page
//   };

//   return (
//     <>
//     <Header /> {/* Add the Header component here */}
//     <div className="main-container">
//       <div className="center-box">
//         <img src={require('../TherapEase_logo.png')} alt="Therapease Logo" className="logo" />
//         <h1 className="app-title">THERAPEASE</h1>
//       </div>
//       <button className="continue-button" onClick={handleContinue}>
//         Continue
//       </button>
//     </div>
//     </>
//   );
// };

// export default Main;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css'; // Optional: Add custom styles if needed
import { Button, Box, Typography } from '@mui/material'; // Import MUI components
// import Header from '../components/Header'; // Import Header

/**
 * Main page displaying the logo and continue button.
 */
const Main = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/login'); // Navigate to the MainLogin page
  };

  return (
    <>
      {/* <Header /> Add the Header component here */}
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          backgroundColor: '#ecf6f6',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <img
            src={require('../TherapEase_logo.png')}
            alt="Therapease Logo"
            style={{ maxWidth: '200px' }} // Optional: Resize logo
          />
          <Typography variant="h3" component="h1" sx={{ mt: 2 }}>
            THERAPEASE
          </Typography>
        </Box>

        {/* MUI Button for Continue */}
        <Button
          variant="contained"
          onClick={handleContinue}
          sx={{
            padding: '15px 30px',
            backgroundColor: '#3B8B8B',
            color: '#EBF3F3',
            borderRadius: '30px',
            fontSize: '16px',
            '&:hover': {
              backgroundColor: '#337777', // Hover effect for button
              color: 'white',
            },
          }}
        >
          Continue
        </Button>
      </Box>
    </>
  );
};

export default Main;
