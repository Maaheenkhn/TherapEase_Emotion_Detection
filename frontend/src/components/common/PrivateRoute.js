// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// /**
//  * PrivateRoute component for protecting routes that require authentication.
//  * @param {React.Component} Component - The component to render.
//  * @param {Object} rest - Remaining props passed to the route.
//  */
// const PrivateRoute = ({ children }) => {
//   const { user } = useAuth(); // Check user session from AuthContext

//   return user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;
