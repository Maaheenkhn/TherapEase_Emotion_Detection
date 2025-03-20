import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { Typography } from '@mui/material';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

import Navbar from '../../components/NavBar';
import SessionComponent from '../../components/SessionComponent';


const TherapistPatientDashboard = () => {
  // State variables for therapist name and patient data
  const [therapistName, setTherapistName] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const { patientNumber } = useParams(); // Extract patientNumber from the URL






  useEffect(() => {
    // Mock fetching patient data based on patientNumber
    const fetchPatientData = async () => {
      try {
        if (!patientNumber) return;  // Ensure that patientNumber exists
        // Replace with an actual API call
        const response = await axios.get(`http://localhost:5000/api/dashboard/${patientNumber}`);
        setPatientData(response.data);  // Save the data in the state
        // setPatientData(data);
      } catch (err) {
        setError('Failed to fetch patient data');
      }
    };

    if (patientNumber) {
      fetchPatientData();
    }
  }, [patientNumber]); // Re-fetch when the patientNumber changes

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!patientData) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div style={{ width: '280px' }}></div>
        <p style={{textAlign: "center", width: '280px', margin: '40px'}} >Generating Visualisations...</p>
      </div>
    );
  }
  
  // Calculate the total sessions
  const totalSessions = patientData.sessions.length;

  // Calculate the total of avgProgressScores (convert to numbers first)
  const totalAvgProgressScore = patientData.sessions.reduce((total, session) => {
    // Convert avgProgressScore to a number before adding it
    const score = parseFloat(session.avgProgressScore);
    return total + score;
  }, 0);

  // Calculate the average progress score
  const averageProgressScore = totalSessions > 0 ? totalAvgProgressScore / totalSessions : 0;




  return (
    <div className="dashboard-container">
      
      <Navbar />
      <div style={{ width: '280px' }}></div>

      <div className="patient-dashboard-left">
        <div className="patient-dashboard-info">
          <div className="patient-dashboard-header">
            <p> {patientData.name}</p>
          </div>
          <div className="patient-dashboard-details">
            <p>{String(patientData.mrn).padStart(4, '0')}</p>
          </div>
          <div className="patient-dashboard-stats">
            <p><strong>Age:</strong> {patientData.age}</p>
            <p><strong>Total Sessions:</strong> {totalSessions}</p>
            <p><strong>Average Score:</strong> {averageProgressScore}</p>
          </div>
        </div>
        
        <div className="patient-dashboard-session">
        <div className="session-header">
          <p className="session-name">{`Sessions`}</p>
          <p className="session-name">{`Correct`}</p>
          <p className="session-name">{`Score`}</p>
        </div>
        <hr style={{ border: '1px solid #ccc', margin: '5px 0 20px 0'}} />
          {patientData.sessions.length > 0 ? (
            patientData.sessions.map((session, index) => (
              <SessionComponent
                key={session.sessionID} // Use sessionID as a unique key
                sessionNumber={index + 1} // Dynamically calculate session number (index + 1)
                sessionID={session.sessionID} // The primary key for session
                totalCorrect={session.totalCorrect} // Total correctly answered
                avgProgressScore={session.avgProgressScore} // Average progress score
                patientName={patientData.name} // Patient's name
                patientNumber={patientData.mrn} // Patient's number 
              />
            ))
          ) : (
            <p style={{textAlign: "center"}}>No sessions found.</p>
          )}

        </div>

      </div>

      {/* Line and Area Graph Section */}
      <div className="patient-dashboard-graphs">
        <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', marginLeft: '20px', fontWeight: 500 }}>
          Patient Performance Over Time
        </Typography>

        {/* Area Chart with Gradient */}
        <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={patientData.sessions}>
            <defs>
                {/* Define the Gradient */}
                <linearGradient id="gradientColor" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#218281" stopOpacity={0.8} />  {/* Teal at the top */}
                  <stop offset="95%" stopColor="rgba(253, 255, 255, 0)" stopOpacity={0} />  {/* Transparent at the bottom */}
                </linearGradient>
              </defs>


              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(date) => dayjs(date).format('MMM DD, YYYY')}  // Formatting the date
              />
              <YAxis dataKey="avgProgressScore"/>
              <Tooltip />
              {/* Apply Gradient Fill */}
              <Area type="monotone" dataKey="avgProgressScore" stroke="#218281" fill="url(#gradientColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>


        {/* Spider Web (Radar) Chart */}
        <Typography variant="h4" gutterBottom style={{ marginTop: '40px', marginBottom: '20px', marginLeft: '20px', fontWeight: 500 }}>
          Patient Performance Overview
        </Typography>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="80%" width="100%" height="100%" data={patientData.performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="Patient Performance" dataKey="value" stroke="#218281" fill="#218281" fillOpacity={0.3} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default TherapistPatientDashboard;
