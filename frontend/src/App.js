
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './pages/Login';  // Import the Login component
// import Dashboard from './pages/Dashboard';  // Import the Dashboard component
// import Signup from './pages/Signup';  // Import the Signup component
// import Home from './pages/Home';  // Import the Home component
// import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

// const App = () => {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Dashboard />} />  {/* Dashboard page */}
//           <Route path="/login" element={<Login />} />  {/* Login page */}
//           <Route path="/signup" element={<Signup />} />  {/* Signup page */}
//           <Route path="/home" element={<Home />} />  {/* Home page */}
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import routes from './routes';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import NotFound from './components/common/NotFound';

/**
 * Main App component - Defines routing and wraps the app with global providers.
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
