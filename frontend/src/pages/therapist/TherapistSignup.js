// // Signup.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';  // Import Link from react-router-dom
// import { validateSignup } from '../components/validations/SignupValidation';  // Import the validation function
// import axios from 'axios';  // Import axios for making HTTP requests

// const Signup = () => {
//   const navigate = useNavigate();  // Initialize useNavigate hook for page navigation


//   // Define state for each form field
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [someDetail, setSomeDetail] = useState('');
//   const [errors, setErrors] = useState({});  // Store validation errors

//   // Handle input changes for all fields
//   const handleInput = (e) => {
//     const { id, value } = e.target;

//     // Dynamically update the corresponding state based on the input field id
//     if (id === 'email') setEmail(value);
//     if (id === 'password') setPassword(value);
//     if (id === 'name') setName(value);
//     if (id === 'age') setAge(value);
//     if (id === 'someDetail') setSomeDetail(value);
//   };

//   // // Handle form submission
//   // const handleSignup = (e) => {
//   //   e.preventDefault();

//   //   // Validate the form data
//   //   const validationErrors = validateSignup(email, password, name, age, someDetail);

//   //   // If there are validation errors, set them in the state
//   //   if (Object.keys(validationErrors).length > 0) {
//   //     setErrors(validationErrors);
//   //     return;  // Stop further processing if there are validation errors
//   //   }

//   //   // If no validation errors, simulate signup process
//   //   const userData = {
//   //     email,
//   //     password,
//   //     name,
//   //     age,
//   //     someDetail
//   //   };

//   //   console.log('Signup data:', userData);

//   //   // Simulate a successful signup process
//   //   alert('Signup successful!');
//   //   // Optionally, navigate to login page or dashboard
//   // };




//   // Handle form submission with Axios POST request
//   const handleSignup = async (e) => {
//     e.preventDefault();

//     // Validate the form data
//     const validationErrors = validateSignup(email, password, name, age, someDetail);

//     // If there are validation errors, set them in the state
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;  // Stop further processing if there are validation errors
//     }

//     // Prepare user data to send
//     const userData = {
//       email,
//       password,
//       name,
//       age,
//       someDetail
//     };

//     try {
//       // Send a POST request to the backend server
//       const response = await axios.post('http://localhost:5000/signup', userData);
//       if (response.data.message === 'Signup successful') {
//         // If signup is successful, navigate to the home page
//         alert('Signup successful!');
//         navigate('/login');  // Navigate to the home page
//       }
//     } catch (error) {
//       // Handle errors (e.g., server errors, validation errors from the server)
//       console.error('Error during signup:', error);
//       alert('Error registering user');
//     }
//   };

//   return (
//     <div className="container">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card mt-5">
//             <div className="card-body">
//               <h3 className="card-title text-center mb-4">Signup</h3>
//               <form onSubmit={handleSignup}>
//                 <div className="form-group">
//                   <label htmlFor="email">Email</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="email"
//                     placeholder="Enter email"
//                     value={email}
//                     onChange={handleInput} // Using handleInput
//                   />
//                   {/* Display email validation error */}
//                   {errors.email && <small className="text-danger">{errors.email}</small>}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="password">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={handleInput} // Using handleInput
//                   />
//                   {/* Display password validation error */}
//                   {errors.password && <small className="text-danger">{errors.password}</small>}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="name">Full Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="name"
//                     placeholder="Enter your full name"
//                     value={name}
//                     onChange={handleInput} // Using handleInput
//                   />
//                   {/* Display name validation error */}
//                   {errors.name && <small className="text-danger">{errors.name}</small>}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="age">Age</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     id="age"
//                     placeholder="Enter your age"
//                     value={age}
//                     onChange={handleInput} // Using handleInput
//                   />
//                   {/* Display age validation error */}
//                   {errors.age && <small className="text-danger">{errors.age}</small>}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="someDetail">Additional Details</label>
//                   <textarea
//                     className="form-control"
//                     id="someDetail"
//                     placeholder="Enter any additional details"
//                     value={someDetail}
//                     onChange={handleInput} // Using handleInput
//                   />
//                   {/* Display someDetail validation error */}
//                   {errors.someDetail && <small className="text-danger">{errors.someDetail}</small>}
//                 </div>
//                 <button type="submit" className="btn btn-primary btn-block">
//                   Signup
//                 </button>
//               </form>

//               <div className="mt-3 text-center">
//                 <Link to="/login" className="btn btn-link">Already have an account? Login</Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;






import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateTherapistSignup } from '../../components/validations/TherapistSignupValidation.js';
import '../../styles/therapist.css';

/**
 * Therapist signup page for registration.
 */
const TherapistSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateTherapistSignup(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log('Signup data:', formData);


    navigate('/therapist/login'); //temp

    // Placeholder for API call to register therapist
    // try {
    //   const response = await fetch('/api/therapist/signup', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     navigate('/therapist/login');
    //   } else {
    //     setErrors({ apiError: data.message });
    //   }
    // } catch (error) {
    //   console.error('Signup error:', error);
    //   setErrors({ apiError: 'Something went wrong. Please try again.' });
    // }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="card-body">
          <h2 className="card-title">Therapist Signup</h2>
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
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
              />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.apiError && <p className="error">{errors.apiError}</p>}

            <button type="submit" className="btn-submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TherapistSignup;

