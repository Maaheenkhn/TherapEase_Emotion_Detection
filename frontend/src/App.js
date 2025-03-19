// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import routes from './routes';
// import NotFound from './components/NotFound';

// /**
//  * Main App component - Defines routing and wraps the app with global providers.
//  */
// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <main>
//           <Routes>
//             {routes.map((route, index) => (
//               <Route key={index} path={route.path} element={route.element} />
//             ))}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </main>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;





import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import routes from "./routes";
import NotFound from "./components/NotFound";
import PageWrapper from "./components/PageWrapper";

/**
 * Main App component - Defines routing with animated transitions and wraps the app with global providers.
 */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={<PageWrapper>{route.element}</PageWrapper>} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );

};

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <main>
          <AnimatedRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;






// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import { AnimatePresence } from 'framer-motion';
// import routes from './routes'; // Import routes configuration
// import NotFound from './components/NotFound'; // Fallback route for 404
// import PageWrapper from './components/PageWrapper'; // Wrapper for page layout
// import PrivateRoute from './components/PrivateRoute'; // PrivateRoute component for route protection

// /**
//  * Main App component - Defines routing with animated transitions and wraps the app with global providers.
//  */
// const AnimatedRoutes = () => {
//   const location = useLocation();

//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         {routes.map((route, index) => {
//           const { path, element, children, requiredRole } = route;

//           // If the route has a requiredRole, wrap it with PrivateRoute
//           const routeElement = requiredRole ? (
//             <PrivateRoute requiredRole={requiredRole}>{element}</PrivateRoute>
//           ) : (
//             element
//           );

//           return (
//             <Route key={index} path={path} element={<PageWrapper>{routeElement}</PageWrapper>}>
//               {children && children.map((child, childIndex) => (
//                 <Route
//                   key={childIndex}
//                   path={child.path}
//                   element={<PrivateRoute requiredRole={child.requiredRole}>{child.element}</PrivateRoute>}
//                 />
//               ))}
//             </Route>
//           );
//         })}
//         {/* Fallback route for 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </AnimatePresence>
//   );
// };

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <main>
//           <AnimatedRoutes />
//         </main>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;


