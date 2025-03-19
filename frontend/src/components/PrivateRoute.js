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


import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth }  from '../contexts/AuthContext';

const PrivateRoute = ({ requiredRole, children }) => {
    const { isAuthenticated, hasRole, isLoading } = useAuth(); // Use AuthContext to check authentication and role
    console.log('in pvt route')
    console.log(isLoading);
    if (!isLoading && !isAuthenticated()) {
        // console.log("Redirecting");
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }

    console.log(requiredRole)
    console.log(hasRole(requiredRole))


    if (!isLoading && requiredRole && !hasRole(requiredRole)) {
        // console.log("Redirecting cuz role");
        return <Navigate to="/login" />; // Redirect to login if the user doesn't have the required role
    }

    return children || <Outlet />; // Ensure that children get rendered here
};

export default PrivateRoute;