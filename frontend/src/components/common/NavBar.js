import React from 'react';
import { Link } from 'react-router-dom';
// import './nav.css'; // Import styles for navigation bar

/**
 * NavBar component for navigation links and user role-based visibility.
 * @param {Array} links - Array of objects with 'path' and 'label' keys.
 */
const NavBar = ({ links }) => {
  return (
    <nav className="nav-bar">
      <ul className="nav-bar__list">
        {links.map((link, index) => (
          <li key={index} className="nav-bar__item">
            <Link to={link.path} className="nav-bar__link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
