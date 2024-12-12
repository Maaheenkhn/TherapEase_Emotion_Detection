// // SignupValidation.js

// export const validateSignup = (email, password, name, age, someDetail) => {
//     const errors = {};
  
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
  
  
//     if (!password) {
//       errors.password = 'Password is required';
//     } else if (password.length < 6) {
//       // Password must be at least 6 characters long
//       errors.password = 'Password must be at least 6 characters long';
//     }
  
//     if (!name) {
//       errors.name = 'Full Name is required';
//     }
  
//     if (!age) {
//       errors.age = 'Age is required';
//     } else if (age <= 0) {
//       errors.age = 'Age must be a positive number';
//     }
  
//     if (!someDetail) {
//       errors.someDetail = 'Additional details are required';
//     }
  
//     return errors;
//   };
  

export const validateTherapistSignup = (data) => {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
