// import React from 'react';
// import './card.css'; // Import the CSS file for styles

// const FlipCard = ({ text }) => {
//   return (
//     <div className='flip-card'>
//       <div className='flip-card-inner'>
//         <div className='flip-card-front'>
//           <h2>{text}</h2> {/* Display the text passed as a prop */}
//         </div>

//         <div className='flip-card-back'>
//           <div className='buttons-container'>
//             <button className='button'>Log In</button>
//             {/* Conditionally render the "Sign Up" button if the text is "Therapist" */}
//             {text === "Therapist" && <button className='button'>Sign Up</button>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlipCard;



import React from 'react';
import { ROUTES } from '../utils/constants';
import '../styles/card.css'; // Import the CSS file for styles
import '../styles/globals.css'; // Import the CSS file for styles


/**
 * FlipCard component with Login and Sign Up buttons.
 * Conditional rendering based on the "text" prop (Therapist or Patient).
 */
const FlipCard = ({ text, navigate }) => {
  // Handler for the "Log In" button
  const handleLoginClick = () => {
    if (text === 'Therapist') {
      navigate(ROUTES.THERAPIST_LOGIN); // Navigate to therapist login page
    } else {
      navigate(ROUTES.PATIENT_LOGIN); // Navigate to patient login page
    }
  };

  // Handler for the "Sign Up" button (only for Therapist)
  const handleSignUpClick = () => {
    navigate(ROUTES.THERAPIST_SIGNUP); // Navigate to therapist sign-up page
  };

  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <h2>{text}</h2> {/* Display the text passed as a prop */}
        </div>

        <div className="flip-card-back">
          <div className="buttons-container">
            <button className="button" onClick={handleLoginClick}>Log In</button>
            {/* Conditionally render the "Sign Up" button if the text is "Therapist" */}
            {text === 'Therapist' && (
              <button className="button" onClick={handleSignUpClick}>Sign Up</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;

