// import React from 'react';
// import { Link } from 'react-router-dom';
// // import './header.css'; // Import styles for the header

// /**
//  * Header component for displaying navigation icons.
//  * Includes Home and Back icons with navigation functionality.
//  */
// const Header = ({ showBack, onBackClick }) => {
//   return (
//     <header className="header">
//       {showBack && (
//         <button onClick={onBackClick} className="header__back-btn">
//           ← Back
//         </button>
//       )}
//       <Link to="/" className="header__home-link">
//         🏠 Home
//       </Link>
//     </header>
//   );
// };

// export default Header;














import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/globals.css'; // Update the import path for header styles

/**
 * Header component for displaying navigation icons.
 * Includes Home and Back icons with navigation functionality.
 */
const Header = ({ showBack, onBackClick }) => {
  return (
    <header className="header">
      <div className="header__left">
        {showBack && (
          <button onClick={onBackClick} className="header__back-btn">
            ← Back
          </button>
        )}
      </div>
      <div className="header__right">
        <Link to="/" className="header__home-link">
          🏠 Home
        </Link>
      </div>
    </header>
  );
};

export default Header;










