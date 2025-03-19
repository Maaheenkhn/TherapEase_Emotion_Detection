import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import PatientComponent from '../../components/PatientComponent'; // Import the Patient component
import Navbar from '../../components/NavBar';
// import axios from 'axios'; // Import Axios for API calls
import '../../styles/therapist.css'; // Reusing styles
import { FaPlus } from 'react-icons/fa'; // Import the Add icon
import { jwtDecode as jwt_decode } from 'jwt-decode';


const TherapistPatients = () => {
  // State variables for patient data and any error message
  const [patientData, setPatientData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Set up the navigate hook

  // // Simulated API call to fetch patients (replace with real API in production)
  // useEffect(() => {
  //   // Uncomment and replace the URL below with your real API endpoint
  //   /*
  //   fetch('https://your-api-endpoint.com/patients')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch patients');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setPatientData(data); // Set the patient data if the fetch is successful
  //     })
  //     .catch(error => {
  //       setError('Failed to load patient data: ' + error.message); // Handle any errors
  //     });
  //   */

  //   // MOCK API CALL (for demonstration purposes)
  //   // Replace this with a real API call in production
  //   setTimeout(() => {
  //     const mockPatientData = [
  //       { name: 'John Doe', number: '0001' },
  //       { name: 'Jane Smith', number: '0002' },
  //       { name: 'Sam Brown', number: '0003' },
  //     ];

  //     setPatientData(mockPatientData); // Simulate successful API call
  //   }, 100); // Simulate a 1-second delay for the API call
  // }, []); // Empty dependency array means this will run once when the component mounts






  const fetchPatients = async () => {
    // Get the JWT token from localStorage or wherever it's stored
    const token = localStorage.getItem('token');  // You may have stored it differently

    if (token) {
      try {
        // Decode the JWT token to get the therapist email
        const decodedToken = jwt_decode(token);
        const therapistEmail = decodedToken.sub.email;  // Assuming 'email' is a property in the JWT


        // Fetch real API data with the therapist email in the headers
        fetch('http://localhost:5000/api/therapist/patients', {
          method: 'GET',
          headers: {
            'Therapist-Email': therapistEmail,  // Include the therapist email in the header
            'Authorization': `Bearer ${token}`  // Optionally include the Bearer token
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch patients');
            }
            return response.json();
          })
          .then(data => {
            setPatientData(data); // Set the patient data if the fetch is successful
          })
          .catch(error => {
            setError('Failed to load patient data: ' + error.message); // Handle any errors
          });
      } catch (error) {
        setError('Error decoding JWT token: ' + error.message);  // Handle any errors related to token decoding
      }
    } else {
      setError('No JWT token found');  // Handle the case when there is no JWT token
    }
  };



  useEffect(() => {


    // // Fetch real API data
    // fetch('http://localhost:5000/api/therapist/patients')  // Update with your actual API endpoint
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch patients');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     setPatientData(data); // Set the patient data if the fetch is successful
    //     console.log(patientData)
    //   })
    //   .catch(error => {
    //     setError('Failed to load patient data: ' + error.message); // Handle any errors
    //   });

      // Fetch the patients when the component is mounted
      fetchPatients();
  }, []); // Empty dependency array means this will run once when the component mounts






  // //   OLD 
  // // Function to handle deleting a patient
  // const handleDeletePatient = async (patientNumber) => {
  //   // try {
  //   //   // Call the backend API to delete the patient
  //   //   //******************change to patient number */
  //   //   const response = await fetch(`https://your-api-endpoint.com/patients/${patientName}`, {
  //   //     method: 'DELETE',
  //   //     headers: {
  //   //       'Content-Type': 'application/json',
  //   //     },
  //   //   });

  //   //   if (!response.ok) {
  //   //     throw new Error('Failed to delete patient');
  //   //   }

  //   //   // If deletion is successful, filter the patient out of the state
  //   //   setPatients(patients.filter(patient => patient.name !== patientName));
  //   // } catch (error) {
  //   //   setError('Failed to delete patient. Please try again later.');
  //   //   console.error(error);
  //   // }
  //   alert(`Patient ${patientNumber} deleted!`);

  // };


//   NEW 
  // Function to handle deleting a patient
  const handleDeletePatient = async (patientNumber) => {
    if (!patientNumber) {
        console.error('Invalid patient number');
        return; // Exit if patient number is not valid
    }
    console.log("patient id:", patientNumber)

    try {
        // Call the backend API to delete the patient using the patient number
        const response = await fetch(`http://localhost:5000/api/delete-patient/${patientNumber}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete patient');
        }
        // Step 2: Fetch the updated list of patients
        await fetchPatients();  // Call to fetch the updated list

        // // If deletion is successful, filter the patient out of the state
        // setPatientData(patientData.filter(patient => patient.patientNumber !== patientNumber));
    } catch (error) {
        setError('Failed to delete patient. Please try again later.');
        console.error(error);
    }    
  // alert(`Patient ${patientNumber} deleted!`);

};


  // Navigate to the add patient page
  const handleAddPatient = () => {
    navigate('/therapist/add-patient'); // Navigate to Add Patient page
  };

  // Navigate to the patient dashboard
  const handlePatientClick = (patientNumber) => {
    navigate(`/therapist/patient/${patientNumber}`); // Navigate to patient dashboard
  };

  return (
    <div className="patient-page-container">        

        <Navbar /> {/* Uncomment when Navbar is ready */}
        <div style={{ width: '350px' }}></div>

        <div className="patient-container">  
            {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
            {/* Show error if there was an issue with the API call */}
            
            {/* Patient Heading Section */}
            <div className="patient-heading">
                <h2>Patients</h2>
                <button className="add-patient-btn" onClick={handleAddPatient}>
                    <FaPlus /> Add 
                </button>
            </div>

            <div className="patients-list">
                {/* <PatientComponent patientName="name" patientNumber="0001" /> */}
                {patientData.length === 0 ? (
                <p>Loading patient data...</p> // Show loading message until data is fetched
                ) : (
                patientData.map((patient, index) => (
                    <PatientComponent
                    key={index}
                    patientName={patient.firstName}
                    patientNumber={patient.patientID}
                    onDelete={handleDeletePatient} // Pass the delete handler to PatientComponent
                    onClick={() => handlePatientClick(patient.number)} // Pass the click handler here
                    />
                ))
                )}
            </div>
        </div>
    </div>
  );
};

// const styles = {
//   pageContainer: {
//     // backgroundColor: '#E0F0F0',
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '20px',
//     marginTop: '40px',
//   },
//   patientsList: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     width: '100%',
//     // maxWidth: '350px',
//   },
// };

export default TherapistPatients;
