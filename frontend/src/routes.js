import React from 'react';

// Import Pages
import Main from './pages/Main';
import MainLogin from './pages/MainLogin';
import TherapistSignup from './pages/therapist/TherapistSignup';
import TherapistLogin from './pages/therapist/TherapistLogin';
import TherapistHome from './pages/therapist/TherapistHome';
import TherapistAddPatient from './pages/therapist/TherapistAddPatient';
import TherapistDeletePatient from './pages/therapist/TherapistDeletePatient';
import TherapistViewPatient from './pages/therapist/TherapistViewPatient';
import TherapistPatientDashboard from './pages/therapist/TherapistPatientDashboard';
import PatientLogin from './pages/patient/PatientLogin';
import PatientHome from './pages/patient/PatientHome';
import PatientDigitalTwin from './pages/patient/PatientDigitalTwin';

// Define route paths and components
const routes = [
  { path: '/', element: <Main /> },
  { path: '/login', element: <MainLogin /> },
  { path: '/therapist/signup', element: <TherapistSignup /> },
  { path: '/therapist/login', element: <TherapistLogin /> },
  { path: '/therapist/home', element: <TherapistHome /> },
  { path: '/therapist/add-patient', element: <TherapistAddPatient /> },
  { path: '/therapist/delete-patient', element: <TherapistDeletePatient /> },
  { path: '/therapist/view-patient', element: <TherapistViewPatient /> },
  { path: '/therapist/patient-dashboard', element: <TherapistPatientDashboard /> },
  { path: '/patient/login', element: <PatientLogin /> },
  { path: '/patient/home', element: <PatientHome /> },
  { path: '/patient/digital-twin', element: <PatientDigitalTwin /> },
];

export default routes;
