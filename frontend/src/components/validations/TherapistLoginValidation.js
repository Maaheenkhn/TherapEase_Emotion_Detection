// // LoginValidation.js

// export const validateLogin = (email, password) => {
//     let errors = {};
    
//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

//     // Check if the email field is empty
//     if (!email) {
//       errors.email = 'Email is required';
//     } else {
//       // Validate email format using regex
//       if (!emailRegex.test(email)) {
//         errors.email = 'Invalid email format';
//       }
//     }
  
//     // Check if the password field is empty
//     if (!password) {
//       errors.password = 'Password is required';
//     } else {
//       // Check for minimum password length (e.g., 6 characters)
//       if (password.length < 6) {
//         errors.password = 'Password must be at least 6 characters long';
//       }
//     }
  
//     // Return errors object, which will be empty if there are no validation issues
//     return errors;
//   };
  

// export const validateTherapistLogin = (data) => {
//   const errors = {};

//   if (!data.email.trim()) {
//     errors.email = 'Email is required';
//   } else if (!/\S+@\S+\.\S+/.test(data.email)) {
//     errors.email = 'Invalid email address';
//   }

//   if (!data.password) {
//     errors.password = 'Password is required';
//   }

//   return errors;
// };

export const validateTherapistLogin = (email, password) => {
  const errors = {};

  // Check if email exists and trim it; otherwise, default to an empty string
  if (!email || !email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
    errors.email = 'Email is invalid.';
  }

  // Check if password exists and trim it; otherwise, default to an empty string
  if (!password || !password.trim()) {
    errors.password = 'Password is required.';
  } else if (password.trim().length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
};
