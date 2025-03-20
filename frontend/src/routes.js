// import React from 'react';

// // Import Pages
// import Main from './pages/Main';
// import MainLogin from './pages/MainLogin';

// import TherapistSignup from './pages/therapist/TherapistSignup';
// import TherapistLogin from './pages/therapist/TherapistLogin';
// import TherapistHome from './pages/therapist/TherapistHome';
// import TherapistProfilePage from './pages/therapist/TherapistProfilePage.js';
// import TherapistPatients from './pages/therapist/TherapistPatients.js';
// import TherapistAddPatient from './pages/therapist/TherapistAddPatient';
// import TherapistPatientDashboard from './pages/therapist/TherapistPatientDashboard';

// import TherapistDeletePatient from './pages/therapist/TherapistDeletePatient';
// import TherapistViewPatient from './pages/therapist/TherapistViewPatient';

// import PatientLogin from './pages/patient/PatientLogin';
// import PatientHome from './pages/patient/PatientHome';
// import PatientDigitalTwin from './pages/patient/PatientDigitalTwin';

// // Define route paths and components
// const routes = [
//   { path: '/', element: <Main /> },
//   { path: '/login', element: <MainLogin /> },

//   { path: '/therapist/signup', element: <TherapistSignup /> },
//   { path: '/therapist/login', element: <TherapistLogin /> },
//   { path: '/therapist/home', element: <TherapistHome /> },
//   { path: '/therapist/profile', element: <TherapistProfilePage /> },
//   { path: '/therapist/patients', element: <TherapistPatients /> },
//   { path: '/therapist/add-patient', element: <TherapistAddPatient /> },
//   { path: '/therapist/patient/:patientNumber', element: <TherapistPatientDashboard /> },

//   { path: '/therapist/delete-patient', element: <TherapistDeletePatient /> },
//   { path: '/therapist/view-patient', element: <TherapistViewPatient /> },
  
//   { path: '/patient/login', element: <PatientLogin /> },
//   { path: '/patient/home', element: <PatientHome /> },
//   { path: '/patient/digital-twin', element: <PatientDigitalTwin /> },
// ];

// export default routes;



import React from 'react';

// Import Pages
import Main from './pages/Main';
import MainLogin from './pages/MainLogin';

import TherapistSignup from './pages/therapist/TherapistSignup';
import TherapistLogin from './pages/therapist/TherapistLogin';
import TherapistHome from './pages/therapist/TherapistHome';
import TherapistProfilePage from './pages/therapist/TherapistProfilePage.js';
import TherapistPatients from './pages/therapist/TherapistPatients.js';
import TherapistAddPatient from './pages/therapist/TherapistAddPatient';
import TherapistPatientDashboard from './pages/therapist/TherapistPatientDashboard';

// import TherapistDeletePatient from './pages/therapist/TherapistDeletePatient';
// import TherapistViewPatient from './pages/therapist/TherapistViewPatient';

import PatientLogin from './pages/patient/PatientLogin';
import PatientHome from './pages/patient/PatientHome';
import PatientDigitalTwin from './pages/patient/PatientDigitalTwin';

// Import PrivateRoute
import PrivateRoute from './components/PrivateRoute';

// Define route paths and components
const routes = [
  { path: '/', element: <Main /> },
  { path: '/login', element: <MainLogin /> },

  // Therapist Routes
  { path: '/therapist/signup', element: <TherapistSignup /> },
  { path: '/therapist/login', element: <TherapistLogin /> },

  // Public Routes for Therapists (e.g., signup and login)
  { path: '/therapist/home', element: (<PrivateRoute requiredRole="therapist"><TherapistHome /></PrivateRoute>) },
  { path: '/therapist/profile', element: (<PrivateRoute requiredRole="therapist"><TherapistProfilePage /></PrivateRoute>) },
  { path: '/therapist/patients', element: (<PrivateRoute requiredRole="therapist"><TherapistPatients /></PrivateRoute>) },
  { path: '/therapist/add-patient', element: (<PrivateRoute requiredRole="therapist"><TherapistAddPatient /></PrivateRoute>) },
  { path: '/therapist/patient/:patientNumber', element: (<PrivateRoute requiredRole="therapist"><TherapistPatientDashboard /></PrivateRoute>) },
  // { path: '/therapist/delete-patient', element: (<PrivateRoute requiredRole="therapist"><TherapistDeletePatient /></PrivateRoute>) },
  // { path: '/therapist/view-patient', element: (<PrivateRoute requiredRole="therapist"><TherapistViewPatient /></PrivateRoute>) },

  // Patient Routes
  { path: '/patient/login', element: <PatientLogin /> },

  // Public Routes for Patients
  { path: '/patient/home', element: (<PrivateRoute requiredRole="patient"><PatientHome /></PrivateRoute>) },
  { path: '/patient/digital-twin', element: (<PrivateRoute requiredRole="patient"><PatientDigitalTwin /></PrivateRoute>) },
];

export default routes;




// // Define route paths and components
// const routes = [
//   { path: '/', element: <Main /> },
//   { path: '/login', element: <MainLogin /> },

//   // Therapist Routes
//   { path: '/therapist/signup', element: <TherapistSignup /> },
//   { path: '/therapist/login', element: <TherapistLogin /> },

//   // Public Routes for Therapists (e.g., signup and login)
//   {
//     path: '/therapist/home',
//     element: (
//       <PrivateRoute requiredRole="therapist"> <TherapistHome /> </PrivateRoute>
//     ),
//   },
//   {
//     path: '/therapist/profile',
//     element: (
//       <PrivateRoute requiredRole="therapist"> <TherapistProfilePage /></PrivateRoute>
//     ),
//   },
//   {
//     path: '/therapist/patients',
//     element: (
//       <PrivateRoute requiredRole="therapist">  <TherapistPatients /></PrivateRoute>
//     ),
//   },
//   {
//     path: '/therapist/add-patient',
//     element: (
//       <PrivateRoute requiredRole="therapist">    <TherapistAddPatient />  </PrivateRoute>
//     ),
//   },
//   {
//     path: '/therapist/patient/:patientNumber',
//     element: (
//       <PrivateRoute requiredRole="therapist">  <TherapistPatientDashboard />  </PrivateRoute>
//     ),
//   },
//   { 
//     path: '/therapist/delete-patient', 
//     element: <PrivateRoute requiredRole="therapist"><TherapistDeletePatient /></PrivateRoute>
//   },
//   {
//     path: '/therapist/view-patient',
//     element: <PrivateRoute requiredRole="therapist"><TherapistViewPatient /></PrivateRoute>
//   },

//   // Patient Routes
//   { path: '/patient/login', element: <PatientLogin /> },

//   // Public Routes for Patients
//   {
//     path: '/patient/home',
//     element: (
//       <PrivateRoute requiredRole="patient"> <PatientHome /> </PrivateRoute>
//     ),
//   },
//   {
//     path: '/patient/digital-twin',
//     element: (
//       <PrivateRoute requiredRole="patient"> <PatientDigitalTwin /> </PrivateRoute>
//     ),
//   },
// ];

// export default routes;















// import React from 'react';
// import { Route } from 'react-router-dom'; // Import Route here
// import Main from './pages/Main';
// import MainLogin from './pages/MainLogin';
// import TherapistSignup from './pages/therapist/TherapistSignup';
// import TherapistLogin from './pages/therapist/TherapistLogin';
// import TherapistHome from './pages/therapist/TherapistHome';
// import TherapistProfilePage from './pages/therapist/TherapistProfilePage.js';
// import TherapistPatients from './pages/therapist/TherapistPatients.js';
// import TherapistAddPatient from './pages/therapist/TherapistAddPatient';
// import TherapistPatientDashboard from './pages/therapist/TherapistPatientDashboard';
// import TherapistDeletePatient from './pages/therapist/TherapistDeletePatient';
// import TherapistViewPatient from './pages/therapist/TherapistViewPatient';
// import PatientLogin from './pages/patient/PatientLogin';
// import PatientHome from './pages/patient/PatientHome';
// import PatientDigitalTwin from './pages/patient/PatientDigitalTwin';
// import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

// // Define route paths and components
// const routes = [
//   { path: '/', element: <Main /> },
//   { path: '/login', element: <MainLogin /> },

//   { path: '/therapist/signup', element: <TherapistSignup /> },
//   { path: '/therapist/login', element: <TherapistLogin /> },

//   // Private Routes for Therapist - Wrap with PrivateRoute
//   {
//     path: '/therapist',
//     element: <PrivateRoute requiredRole="therapist" />, // Protect all therapist routes
//     children: [
//       { path: 'home', element: <TherapistHome /> },
//       { path: 'profile', element: <TherapistProfilePage /> },
//       { path: 'patients', element: <TherapistPatients /> },
//       { path: 'add-patient', element: <TherapistAddPatient /> },
//       { path: 'patient/:patientNumber', element: <TherapistPatientDashboard /> },
//       { path: 'delete-patient', element: <TherapistDeletePatient /> },
//       { path: 'view-patient', element: <TherapistViewPatient /> },
//     ],
//   },

//   // Private Routes for Patient - Wrap with PrivateRoute
//   {
//     path: '/patient',
//     element: <PrivateRoute requiredRole="patient" />, // Protect all patient routes
//     children: [
//       { path: 'home', element: <PatientHome /> },
//       { path: 'digital-twin', element: <PatientDigitalTwin /> },
//     ],
//   },

//   { path: '/patient/login', element: <PatientLogin /> },
// ];

// export default routes;


