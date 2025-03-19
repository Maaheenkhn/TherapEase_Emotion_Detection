import React, { useState } from 'react';
import { Card, CardContent, Button, TextField, Box, Typography, Divider, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import Navbar from '../../components/NavBar';
import profileImage from '../../profile.png';  // Adjust path accordingly



const TherapistProfilePage = () => {
  // States for the profile details
  //load all this from DB *******************
  const [selectedOption, setSelectedOption] = useState('personalDetails');
  const [profilePicture, setProfilePicture] = useState(profileImage); // Sample image URL
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [dob, setDob] = useState('1990-01-01');
  const [bio, setBio] = useState('A short bio about the therapist.');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password123');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  // Handler for changing the profile picture
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  // Handler for changing selected options
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  // Handler for changing password
  // confirm with old password from and update new in DB ******************
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
    } else {
      setPassword(newPassword);  // Update password to the new one
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully!');
      setSelectedOption('loginDetails');  // Go back to login details after submission
    }
  };



  // Placeholder API call function (for simulating the database update)
  const updateProfileInDatabase = () => {
    // Uncomment the code below when integrating with an actual API
    /*
    fetch('/api/updateProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profilePicture,
        firstName,
        lastName,
        dob,
        bio,
        email,
        password, // You may decide if you want to update password here
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Profile updated successfully:', data);
      alert('Profile updated successfully!');
    })
    .catch((error) => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    });
    */
    alert('Profile updated (simulated)');
  };


  return (
    <Box sx={{
      display: 'flex',    
      flexDirection: 'row', // Stack divs vertically
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#ecf6f6',
      // marginTop: '32px', // Adding margin-top to create space for the navbar (adjust the value based on your navbar height)
      padding: '0 18px' // Adding some padding around the content
    }}>

      <Navbar /> 

      <Box sx={{
        width: '350px'
      }}>
      </ Box >


      {/* Left Card */}
      <Card sx={{
        width: '20%',
        height: '50%',
        marginRight: 8,
        padding: 2,
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0)',
        backgroundColor: '#e0f0f0'
      }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={profilePicture}
            alt="Profile"
            style={{ width: '150px', height: '150px', borderRadius: '50%', margin: 16 }}
          />
          <Typography variant="h6" sx={{ marginTop: 2, color: '#2f2f2f' }}>
            {firstName} {lastName}
          </Typography>
          <Divider sx={{ margin: '10px 0' }} />
          {/* Navigation items */}
            <Button
              onClick={() => handleOptionClick('personalDetails')}
              fullWidth
              sx={{
                marginBottom: 3,
                color: selectedOption === 'personalDetails' ? '#e0f0f0' : '#389c9b',
                backgroundColor: selectedOption === 'personalDetails' ? '#389c9b' : 'transparent',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: selectedOption !== 'personalDetails' ? '#9fd8db' : '#389c9b',
                  color: selectedOption !== 'personalDetails' ? '#389c9b' : '#e0f0f0',
                }
              }}
            >
              Personal Details
            </Button>

            <Button
              onClick={() => handleOptionClick('loginDetails')}
              fullWidth
              sx={{
                marginBottom: 1,
                color: selectedOption === 'loginDetails' ? '#e0f0f0' : '#389c9b',
                backgroundColor: selectedOption === 'loginDetails' ? '#389c9b' : 'transparent',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: selectedOption !== 'loginDetails' ? '#9fd8db' : '#389c9b',
                  color: selectedOption !== 'loginDetails' ? '#389c9b' : '#e0f0f0',
                }
              }}
            >
              Login Details
            </Button>

            <Button
              onClick={() => alert('Logged out')}
              fullWidth
              sx={{
                color: '#389c9b',
                backgroundColor: 'transparent',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#9fd8db',
                  color: '#389c9b',
                }
              }}
            >
              Logout
            </Button>

        </CardContent>
      </Card>

      {/* Right Card (Main Content) */}
      <Card sx={{
        flex: 1,
        marginRight: 6,
        padding: 2,
        paddingLeft: 6,
        paddingRight: 6,
        // height: '75vh',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0)',
        backgroundColor: '#e0f0f0',
        maxWidth: '40%'
      }}>
        <CardContent>
          {selectedOption === 'personalDetails' && (
            <Box>
              <Typography variant="h6">Personal Details</Typography>

              {/* Profile Picture */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 2,  // Adds margin above the profile picture
                marginBottom: 2  // Adds margin below the profile picture
              }}>
                <img
                  src={profilePicture}
                  alt="Profile"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    // border: '2px solid #9fd8db',
                    objectFit: 'cover'
                  }}
                />
                <IconButton
                  onClick={() => document.getElementById('profile-picture-input').click()}
                  sx={{
                    marginLeft: 2,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: '#f1f1f1',
                    }
                  }}
                >
                  <EditIcon sx={{ color: 'none' }} />
                </IconButton>
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }} // Hides the default file input
                />
              </Box>

              <TextField
                label="First Name"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Date of Birth"
                fullWidth
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                margin="normal"
              />

              {/* Apply Button (Only for Personal Details section) */}
              <Button
                variant="contained"
                onClick={updateProfileInDatabase}  // This will simulate the database update
                sx={{
                      marginTop: 2,
                      backgroundColor: '#389c9b',
                      color: '#e0f0f0',  // Text color
                      '&:hover': {
                        backgroundColor: '#2c7a77',  // Darker shade for hover
                      },
                    }}
                  >
                Apply
              </Button>
            </Box>
          )}

          {selectedOption === 'loginDetails' && (
            <Box>
              <Typography variant="h6">Login Details</Typography>
              <TextField
                label="Email"
                fullWidth
                value={email}
                disabled
                margin="normal"
              />
              <TextField
                label="Password"
                fullWidth
                value={password}
                disabled
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={() => setSelectedOption('changePassword')}
                sx={{
                  marginTop: 2,
                  backgroundColor: '#389c9b',
                  color: '#e0f0f0',  // Text color
                  '&:hover': {
                    backgroundColor: '#2c7a77',  // Darker shade for hover
                  },
                }}
              >
                Change Password
              </Button>
            </Box>
          )}

          {selectedOption === 'changePassword' && (
            <Box>
              <Typography variant="h6">Change Password</Typography>
              <TextField
                label="Current Password"
                fullWidth
                type="password"
                margin="normal"
              />
              <TextField
                label="New Password"
                fullWidth
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Confirm New Password"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={handleChangePassword}
                sx={{
                  marginTop: 2,
                  backgroundColor: '#389c9b',
                  color: '#e0f0f0',  // Text color
                  '&:hover': {

                    backgroundColor: '#2c7a77',  // Darker shade for hover
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>



    </Box>
  );
};

export default TherapistProfilePage;