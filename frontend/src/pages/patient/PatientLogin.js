import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
// import axios from 'axios'; // Import axios for making HTTP requests
import { validatePatientLogin } from '../../components/validations/PatientLoginValidation'; // Import validatePatientLogin function
import Wave from '../../components/Wave'; // Import Wave component
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap for styling
import { useAuth } from '../../contexts/AuthContext';


const PatientLogin = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook for page navigation
  const { login } = useAuth(); // Use the login function from AuthContext

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrors] = useState({}); // Store errors as an object

  // handleInput function that updates the state dynamically for email and password fields
  const handleInput = (e) => {
    const { name, value } = e.target;

    // Update the specific field (email or password) based on the name attribute
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault(); // Prevent the default form submission behavior (page reload)

  //   // Validate form input using the validatePatientLogin function
  //   const validationErrors = validatePatientLogin(email, password);

  //   // If there are validation errors, set them in the state
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors); // Update errors state with the validation errors
  //   } else {
  //     // Proceed with login by sending data to the backend using axios
  //     navigate('/patient/home'); // Navigate to the patient home page
        
  //   //   const loginData = { email, password };
  //   //   axios
  //   //     .post('http://localhost:5000/patient/login', loginData)
  //   //     .then((response) => {
  //   //       // Handle success: navigate to patient home page
  //   //       console.log('Patient login successful:', response.data);
  //   //       navigate('/patient/home'); // Navigate to the patient home page
  //   //     })
  //   //     .catch((err) => {
  //   //       // Handle error: display error message
  //   //       console.error('Error during login:', err.response ? err.response.data : err.message);

  //   //       // If the error response has a message, show it; otherwise, use a default message
  //   //       const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';

  //   //       // Set the error message in the error state to display it on the frontend
  //   //       setErrors({ login: errorMessage });
  //   //     });
  //   }
  // };



   const handleSubmit = async (e) => {
      e.preventDefault();  // Prevent the default form submission behavior (page reload)
  
    // Validate form input using the validatePatientLogin function
    const validationErrors = validatePatientLogin(email, password);
  
      // If there are validation errors, set them in the state
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);  // Update errors state with the validation errors
      } else {
        // Proceed with login by sending data to the backend using axios
        
        // navigate('/therapist/home');  // Navigate to the home page
  
        const loginData = { email, password };
        console.log('Login data:', loginData);
  
        try {
          const response = await fetch('http://localhost:5000/api/patient/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData), // Send the loginData as JSON
          });
      
          if (!response.ok) {
            // If response status is not 2xx, throw an error
            const errorData = await response.json();
            throw new Error(errorData.error || 'An unexpected error occurred');
          }
      
          const data = await response.json(); // Parse the JSON response from the server
          console.log('Login successful:', data);
          // Optionally, you can call a function to store the access token or handle the user login
          login(data.token); // Set user context or token
  
          navigate('/patient/home'); // Navigate to the home page
      
        } catch (err) {
          console.error('Error during login:', err.message);
      
          // Handle error: display error message
          setErrors({ login: err.message }); // Set the error state to show the error message
        }
  
      }
    };

  return (
    <div className="login-container">
      <Wave />
      <div className="login-card">
        <div className="card-body">
          <h3 className="card-title text-center">Patient Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={handleInput}
              />
              {error.email && <small className="error">{error.email}</small>}
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={handleInput}
              />
              {error.password && <small className="error">{error.password}</small>}
            </div>
  
            {Object.keys(error).length > 0 && !error.email && !error.password && !error.login && (
              <div className="alert alert-danger mt-2">Please fill in both fields.</div>
            )}
  
            {error.login && <div className="alert alert-danger mt-2">{error.login}</div>}
  
            <button type="submit" className="btn-submit btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
