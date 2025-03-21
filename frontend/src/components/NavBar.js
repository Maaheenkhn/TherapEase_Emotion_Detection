// import React from 'react';
// import { Link } from 'react-router-dom';
// // import './nav.css'; // Import styles for navigation bar

// /**
//  * NavBar component for navigation links and user role-based visibility.
//  * @param {Array} links - Array of objects with 'path' and 'label' keys.
//  */
// const NavBar = ({ links }) => {
//   return (
//     <nav className="nav-bar">
//       <ul className="nav-bar__list">
//         {links.map((link, index) => (
//           <li key={index} className="nav-bar__item">
//             <Link to={link.path} className="nav-bar__link">
//               {link.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default NavBar;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import TherapEaseLogo from '../TherapEase_logo.png'; // Import your PNG image
import '../styles/navbar.css';
import { useAuth } from '../contexts/AuthContext';

  




  
const Navbar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  

  const { logout } = useAuth(); // Use AuthContext to get user details and logout function

  const handleLogout = () => {
      logout(); // Log out the user
      navigate('/'); // Redirect to login page
  };
  
  
// Function to handle item clicks
  const handleItemClick = (item, path) => {
    setSelectedItem(item);
    navigate(path);
  };

  // Effect to set the selected item based on the current URL path
  useEffect(() => {
    const path = location.pathname; // Get the current path
    switch (path) {
      case '/therapist/home':
        setSelectedItem('Home');
        break;
      case '/therapist/patients':
        setSelectedItem('Patients');
        break;
      case '/therapist/add-patient':
        setSelectedItem('Patients');
        break;
      case /^\/therapist\/patient\/\d+$/.test(window.location.pathname):
        setSelectedItem('Patients');
        break;
      case '/therapist/profile':
        setSelectedItem('Profile');
        break;
      default:
        setSelectedItem(null); // Reset if no match
    }
    if (/^\/therapist\/patient\/\d+$/.test(window.location.pathname)) {
      setSelectedItem('Patients');
    }
  }, [location.pathname]); // Re-run effect when the path changes




  return (
    <div className="navbar">
      {/* Inline SVG Logo */}
      <div className="logo">
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="150" height="150"> */}
          {/* Replace with your logo SVG path or other content */}
          {/* <circle cx="50" cy="50" r="40" fill="black" /> */}
        {/* </svg> */}

        <img src={TherapEaseLogo} alt="My Logo" width="160" height="150" /> {/* Set width and height */}

      </div>

      {/* Navigation Items */}
      {/* <div> */}
        <NavItem 
          label="Home" 
          selected={selectedItem === 'Home'} 
          onClick={() => handleItemClick('Home', '/therapist/home')}
        />
        <NavItem
          label="Patients"
          selected={selectedItem === 'Patients'}
          onClick={() => handleItemClick('Patients', '/therapist/patients')}
        />
        <NavItem 
          label="Profile" 
          selected={selectedItem === 'Profile'} 
          onClick={() => handleItemClick('Profile', '/therapist/profile')}
        />
        {/* <NavItem 
          label="Services" 
          selected={selectedItem === 'Services'} 
          onClick={() => handleItemClick('Services', '/services')}
        /> */}

        <div style={{ height: '370px'}}></div>


        <NavItem 
          label="Log Out" 
          onClick={() => handleLogout()}
        />    
      </div>

      
    // </div>
  );
};

const NavItem = ({ label, selected, onClick }) => {
  return (
    <div
      className={`nav-item ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Navbar;