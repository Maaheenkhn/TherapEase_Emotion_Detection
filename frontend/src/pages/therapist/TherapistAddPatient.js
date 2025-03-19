import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePatientSignup } from '../../components/validations/PatientSignupValidation'; // Import validatePatientLogin function
import '../../styles/therapist.css'; // Reusing styles
import Navbar from '../../components/NavBar';
import { jwtDecode as jwt_decode } from 'jwt-decode';




/**
 * Therapist page to add/register a new patient.
 */
const TherapistAddPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate form data
  //   const validationErrors = validatePatientSignup(formData);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   setErrors({});
  //   console.log('New patient data:', formData);

  //   navigate('/therapist/home'); //temp

  //   //CONVERT THE DOB TO AGE BEFORE SENDING 

  //   // Placeholder for API call to add/register a patient
  //   // try {
  //   //   const response = await fetch('/api/patient/signup', {
  //   //     method: 'POST',
  //   //     headers: {
  //   //       'Content-Type': 'application/json',
  //   //     },
  //   //     body: JSON.stringify(formData),
  //   //   });
  //   //   const data = await response.json();
  //   //   if (response.ok) {
  //   //     navigate('/therapist/home');
  //   //   } else {
  //   //     setErrors({ apiError: data.message });
  //   //   }
  //   // } catch (error) {
  //   //   console.error('Patient signup error:', error);
  //   //   setErrors({ apiError: 'Something went wrong. Please try again.' });
  //   // }
  // };




const handleSubmit = async (e) => {
    // Get the JWT token from localStorage or wherever it's stored
    const token = localStorage.getItem('token');  // You may have stored it differently
    const decodedToken = jwt_decode(token);
    const therapistEmail = decodedToken.sub.email;  // Assuming 'email' is a property in the JWT

    e.preventDefault();

    // Validate form data
    const validationErrors = validatePatientSignup(formData);
  if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log('New patient data:', formData);



    // API call to register therapist
    try {
      const response = await fetch('http://localhost:5000/api/therapist/add-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Therapist-Email': therapistEmail,  // Include the therapist email in the header
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/therapist/patients');
      } else {
        setErrors({ apiError: data.message });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ apiError: 'Something went wrong. Please try again.' });
    }
  };







  return (
    <div className="add-patient-page-container">

      <Navbar /> {/* Uncomment when Navbar is ready */}
      <div style={{ width: '350px' }}></div>
    
      <div className="signup-container">
        <div className="signup-card">
          <div className="card-body">
            <h2 className="card-title">Add Patient</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
              </div>

              {errors.apiError && <p className="error">{errors.apiError}</p>}

              <button type="submit" className="btn-submit">
                Add Patient
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TherapistAddPatient;

