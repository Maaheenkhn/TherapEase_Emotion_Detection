

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
// import axios from 'axios';  // Import axios for making HTTP requests
import { validateTherapistLogin } from '../../components/validations/TherapistLoginValidation.js';  // Import validateLogin function
import '../../styles/therapist.css'; // Reusing styles
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();  // Initialize useNavigate hook for page navigation


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrors] = useState({});  // Store errors as an object

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
  //   e.preventDefault();  // Prevent the default form submission behavior (page reload)

  //   // Validate form input using the validateLogin function
  //   const validationErrors = validateLogin(email, password);

  //   // If there are validation errors, set them in the state
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);  // Update errors state with the validation errors
  //   } else {
  //     // Proceed with login, since no errors were found
  //     console.log('Form is valid. Proceed with login.');
  //     // Perform login logic here (e.g., call API or redirect to another page)
  //   }
  // };
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent the default form submission behavior (page reload)

    // Validate form input using the validateLogin function
    const validationErrors = validateTherapistLogin(email, password);

    // If there are validation errors, set them in the state
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);  // Update errors state with the validation errors
    } else {
      // Proceed with login by sending data to the backend using axios
      
      navigate('/therapist/home');  // Navigate to the home page

    //   const loginData = { email, password };
    //   axios.post('http://localhost:5000/login', loginData)
    //     .then((response) => {
    //       // Handle success: navigate to /home
    //       console.log('Login successful:', response.data);
    //       navigate('/home');  // Navigate to the home page
    //     })
    //     .catch((err) => {
    //       // // Handle error: display error message
    //       // console.error('Error during login:', err.response ? err.response.data : err.message);
    //       // setErrors({ login: 'Invalid email or password' });  // Set general login error

    //       // Handle error: display error message
    //       console.error('Error during login:', err.response ? err.response.data : err.message);

    //       // If the error response has a message, show it; otherwise, use a default message
    //       const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';

    //       // Set the error message in the error state to display it on the frontend
    //       setErrors({ login: errorMessage });  
    //     });
    }
  };

//   return (
//     <div className="container">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card mt-5">
//             <div className="card-body">
//               <h3 className="card-title text-center mb-4">TherapistLogin</h3>
//               <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                   <label htmlFor="email">Email address</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     name="email"  // Add name to associate with handleInput
//                     placeholder="Enter email"
//                     value={email}
//                     onChange={handleInput}  // Use handleInput for dynamic input handling
//                   />
//                   {/* Display email validation error */}
//                   {error.email && <small className="text-danger">{error.email}</small>}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="password">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     name="password"  // Add name to associate with handleInput
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={handleInput}  // Use handleInput for dynamic input handling
//                   />
//                   {/* Display password validation error */}
//                   {error.password && <small className="text-danger">{error.password}</small>}
//                 </div>

//                 {/* Display general form error */}
//                 {Object.keys(error).length > 0 && !error.email && !error.password && !error.login && (
//                   <div className="alert alert-danger mt-2">Please fill in both fields.</div>
//                 )}
//                 {/* Display general login error */}
//                 {error.login && (
//                   <div className="alert alert-danger mt-2">{error.login}</div>
//                 )}
//                 <button type="submit" className="btn btn-primary btn-block">
//                   Login
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// return (
//   <div className="w-80 rounded-lg shadow h-auto p-6 bg-white relative overflow-hidden">
//     <div className="flex flex-col justify-center items-center space-y-2">
//       <h2 className="text-2xl font-medium text-slate-700">Therapist Login</h2>
//       <p className="text-slate-500">Enter your credentials below.</p>
//     </div>
//     <form className="w-full mt-4 space-y-3" onSubmit={handleSubmit}>
//       <div>
//         <input
//           className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
//           placeholder="Email"
//           id="email"
//           name="email"
//           type="email"
//           value={email}
//           onChange={handleInput}
//         />
//         {error.email && <small className="text-red-500">{error.email}</small>}
//       </div>
//       <div>
//         <input
//           className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
//           placeholder="Password"
//           id="password"
//           name="password"
//           type="password"
//           value={password}
//           onChange={handleInput}
//         />
//         {error.password && <small className="text-red-500">{error.password}</small>}
//       </div>

//       {Object.keys(error).length > 0 && !error.email && !error.password && (
//         <div className="alert alert-danger mt-2 text-red-500">
//           Please fill in both fields.
//         </div>
//       )}

//       <button
//         type="submit"
//         className="w-full justify-center py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white"
//       >
//         Login
//       </button>

//       <p className="flex justify-center space-x-1">
//         <span className="text-slate-700">Have an account?</span>
//         <a className="text-blue-500 hover:underline" href="#">Sign Up</a>
//       </p>
//     </form>
//   </div>
// );
// };

return (
  <div className="login-container">
    <div className="login-card">
      <div className="card-body">
        <h3 className="card-title">Therapist Login</h3>
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
            {error.email && <small className="error-text">{error.email}</small>}
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
            {error.password && <small className="error-text">{error.password}</small>}
          </div>

          {Object.keys(error).length > 0 && !error.email && !error.password && !error.login && (
            <div className="alert alert-danger">Please fill in both fields.</div>
          )}

          {error.login && <div className="alert alert-danger">{error.login}</div>}

          <button type="submit" className="btn-submit">
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
);
};

export default Login;
