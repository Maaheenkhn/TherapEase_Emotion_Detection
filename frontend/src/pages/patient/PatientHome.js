import React, { useEffect, useState } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode'; // Import jwt-decode library
import '../../styles/patient.css'; // Import patient-specific CSS styles
import QuizScene from '../../components/DigitalTwinComponent';

const Home = () => {
  const [isQuizSceneVisible, setIsQuizSceneVisible] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading
  const [sessionInitialized, setSessionInitialized] = useState(false); // Track if session is initialized
  const [sessionID, setSessionID] = useState(0); // State for session ID
  const [patientEmail, setPatientEmail] = useState(null); // State for storing the patient's email

  // UseEffect to initialize session and display the quiz scene after 12 seconds
  useEffect(() => {
    // Get the JWT token from localStorage or wherever it's stored
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found!');
      return;
    }

    // Decode the JWT token to extract the patient's email
    const decodedToken = jwt_decode(token);
    const email = decodedToken.sub.email; // Assuming 'email' is a property in the JWT

    setPatientEmail(email); // Set the email in the state
    console.log("Patient email set:", email); // For debugging
  }, []); // Run once when the component mounts

  // Function to initialize the session
  const initializeSession = async () => {
    if (!patientEmail) {
      console.error('Patient email is not set!');
      return;
    }

    console.log("Initializing session...");

    // Prevent re-running if session is already initialized
    if (sessionInitialized) {
      console.log("Session already initialized.");
      return;
    }

    try {
      // Send a request to initialize the session with the patient's email
      const token = localStorage.getItem('token');
      console.log("Sending request to initialize session...");

      const response = await fetch('http://localhost:5000/initialize-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the authorization token
        },
        body: JSON.stringify({
          email: patientEmail,  // Send the email for session initialization
        }),
      });

      // Log the response status and the response body
      console.log("Response Status:", response.status);

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        const sessionID = data.sessionID; // Retrieve the sessionID from the response
        console.log("Session initialized with ID:", sessionID);

        setSessionID(sessionID);
        setSessionInitialized(true); // Mark the session as initialized

        // Wait for 12 seconds after the request
        setTimeout(() => {
          console.log("12 seconds passed. Setting loading to false and showing quiz...");
          setLoading(false); // Set loading to false after 12 seconds
          setIsQuizSceneVisible(true); // Show the QuizScene component
        }, 12000); // 12 seconds in milliseconds
      } else {
        console.error('Failed to initialize session');
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  // Run session initialization after the email is set
  useEffect(() => {
    if (patientEmail) {
      initializeSession();
    }
  }, [patientEmail]); // This will run once patientEmail is set

  return (
    <div className="threejs-container">
      {loading ? (
        <div className="loader" style={{ backgroundColor: "#ecf6f6", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {console.log('Rendering loading spinner...')}
          <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
            <div className="wheel" />
            <div className="hamster">
              <div className="hamster__body">
                <div className="hamster__head">
                  <div className="hamster__ear" />
                  <div className="hamster__eye" />
                  <div className="hamster__nose" />
                </div>
                <div className="hamster__limb hamster__limb--fr" />
                <div className="hamster__limb hamster__limb--fl" />
                <div className="hamster__limb hamster__limb--br" />
                <div className="hamster__limb hamster__limb--bl" />
                <div className="hamster__tail" />
              </div>
            </div>
            <div className="spoke" />
          </div>
        </div>
      ) : (
        isQuizSceneVisible && <QuizScene sessionId={sessionID} />
      )}

      
    </div>
  );
};

export default Home;
