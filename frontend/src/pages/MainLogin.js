import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
// import Header from '../components/common/Header';
import '../styles/mainlogin.css'; // Optional: Add custom styles

/**
 * MainLogin page with Therapist and Patient sections.
 */
const MainLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="main-login-container">
      <div className="main-login-content">
        {/* Therapist Section */}
        <div className="login-rectangle therapist-rectangle">
          <h2 className="rectangle-title">Therapist</h2>
          <div class="button-container">
            <button
              className="login-button"
              onClick={() => navigate(ROUTES.THERAPIST_SIGNUP)}
            >
              Sign Up
            </button>
            <button
              className="login-button"
              onClick={() => navigate(ROUTES.THERAPIST_LOGIN)}
            >
              Login
            </button>
          </div>
        </div>

        {/* Patient Section */}
        <div className="login-rectangle patient-rectangle">
          <h2 className="rectangle-title">Patient</h2>
          <div class="button-container">
            <button
              className="login-button"
              onClick={() => navigate(ROUTES.PATIENT_LOGIN)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLogin;
