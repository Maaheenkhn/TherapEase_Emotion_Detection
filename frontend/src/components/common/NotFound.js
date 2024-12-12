import React from 'react';
import { Link } from 'react-router-dom';
// import './notfound.css'; // Import styles for Not Found page

/**
 * NotFound component to display a 404 page for unmatched routes.
 */
const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="not-found__home-link">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
