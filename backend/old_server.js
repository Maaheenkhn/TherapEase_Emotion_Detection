// server.js


// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();

// // Middlewares
// app.use(cors());  // Allow cross-origin requests
// app.use(bodyParser.json());  // Parse incoming JSON requests

// // Sample in-memory "database" (for the sake of example)
// const users = [];

// // Environment variable for JWT secret key
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// // Signup Route
// app.post('/signup', async (req, res) => {
//   const { email, password, name, age, someDetail } = req.body;

//   // Check if any field is missing
//   if (!email || !password || !name || !age || !someDetail) {
//     return res.status(400).json({ error: 'Please fill in all fields' });
//   }

//   // Check if email is already in use
//   const existingUser = users.find(user => user.email === email);
//   if (existingUser) {
//     return res.status(400).json({ error: 'Email already in use' });
//   }

//   try {
//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save the user (in-memory for now)
//     const newUser = { email, password: hashedPassword, name, age, someDetail };
//     users.push(newUser);

//     // Send a success response
//     res.status(201).json({ message: 'Signup successful' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// // Login Route
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Check if the user exists
//   const user = users.find(user => user.email === email);
//   if (!user) {
//     return res.status(400).json({ error: 'Invalid email or password' });
//   }

//   try {
//     // Compare password with the hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ error: 'Invalid email or password' });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

//     // Send the token in the response
//     res.json({ message: 'Login successful', token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// // Middleware to protect routes (e.g., user dashboard)
// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Access denied' });

//   try {
//     const verified = jwt.verify(token, JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// // Protected route example (e.g., user dashboard)
// app.get('/dashboard', authenticateToken, (req, res) => {
//   res.json({ message: 'Welcome to your dashboard', user: req.user });
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// const express = require("express");
// const mysql = require("mysql");
// const cors = require("cors");


// const app = express();
// app.use(cors());


// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     dataabase:"signup"
// })



// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middlewares
app.use(cors());  // Allow cross-origin requests
app.use(bodyParser.json());  // Parse incoming JSON requests

// MySQL database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
//   database: process.env.DB_NAME || 'loginsignup', // Update with your actual database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the MySQL server:', err);
      return;
    }
  
    console.log('Connected to MySQL server');
  
    const dbName = process.env.DB_NAME || 'loginsignup';  // Use the DB_NAME from environment variables
  
    // Check if the database exists
    db.query(`SHOW DATABASES LIKE '${dbName}'`, (err, result) => {
      if (err) {
        console.error('Error checking database:', err);
        return;
      }
  
      if (result.length === 0) {
        // Database doesn't exist, so we create it
        console.log(`Database "${dbName}" not found, creating...`);
  
        db.query(`CREATE DATABASE ${dbName}`, (err) => {
          if (err) {
            console.error('Error creating database:', err);
            return;
          }
  
          console.log(`Database "${dbName}" created successfully`);
  
          // Switch to the newly created database
          db.changeUser({ database: dbName }, (err) => {
            if (err) {
              console.error('Error switching to database:', err);
              return;
            }
  
            // Create tables or perform any setup you need for the new database
            const createTableQuery = `
              CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                someDetail TEXT NOT NULL
              )
            `;
  
            db.query(createTableQuery, (err) => {
              if (err) {
                console.error('Error creating tables:', err);
                return;
              }
  
              console.log('Users table created successfully!');
            });
          });
        });
      } else {
        console.log(`Database "${dbName}" exists. Switching...`);
  
        // Switch to the existing database
        db.changeUser({ database: dbName }, (err) => {
          if (err) {
            console.error('Error switching to database:', err);
            return;
          }
  
          console.log('Successfully connected to the database!');
        });
      }
    });
  });

// Signup Route
app.post('/signup', (req, res) => {
  const { email, password, name, age, someDetail } = req.body;

  // Check if any field is missing
  if (!email || !password || !name || !age || !someDetail) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  // Check if email already exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Insert new user into the database
    const query = 'INSERT INTO users (email, password, name, age, someDetail) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [email, password, name, age, someDetail], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error registering user' });
      }

      res.status(201).json({ message: 'Signup successful' });
    });
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if email exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    // Check if the provided password matches the stored password
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Login successful
    res.json({ message: 'Login successful', userId: user.id, email: user.email });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
