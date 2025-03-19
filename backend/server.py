from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)


# Initialize extensions
# mysql = MySQL(app)  # Correct initialization
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure Flask app
app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST", "localhost")
app.config['MYSQL_USER'] = os.getenv("MYSQL_USER", "root")
app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD", "")
app.config['MYSQL_DB'] = os.getenv("MYSQL_DB", "therapease")
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "your_secret_key")

# Create a MySQL connection pool
dbconfig = {
    "host": app.config['MYSQL_HOST'],
    "user": app.config['MYSQL_USER'],
    "password": app.config['MYSQL_PASSWORD'],
    "database": app.config['MYSQL_DB'],
    "pool_name": "mypool",
    "pool_size": 32
}

# Create the pool
pool = mysql.connector.pooling.MySQLConnectionPool(**dbconfig)

# # Get a connection from the pool
# connection = pool.get_connection()

# connection = None
# db_host = app.config['MYSQL_HOST']
# db_user = app.config['MYSQL_USER']
# db_password = app.config['MYSQL_PASSWORD']
# db_name = app.config['MYSQL_DB']
# connection = mysql.connector.connect(
#             host=db_host,
#             user=db_user,
#             password=db_password,
#             database=db_name
#         )

# # Test route to verify MySQL connection using mysql.connector
# @app.route('/test-db', methods=['GET'])
# def test_db():
#     try:
#         # Use mysql.connector to manually create the connection
#         connection = pool.get_connection()


#         # Check if the connection was established
#         if not connection.is_connected():
#             return jsonify({"error": "MySQL connection failed"}), 500

#         cursor = connection.cursor()
#         cursor.execute("SELECT DATABASE();")
#         current_db = cursor.fetchone()

#         # Return the result
#         return jsonify({"message": f"Connected to database: {current_db[0]}"}), 200

#     except Exception as e:
#         # Return any exceptions as error messages
#         return jsonify({"error": str(e)}), 500

#     finally:
#         # Always close the connection and cursor
#         if connection.is_connected():
#             cursor.close()
#             connection.close()







def calculate_age(date_of_birth_str):
    # Convert the string to a datetime object
    date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d')
    
    # Get the current date
    current_date = datetime.now()
    
    # Calculate age by subtracting birthdate from current date and converting it to years
    age = current_date.year - date_of_birth.year
    
    # Adjust if the birthday hasn't occurred yet this year
    if current_date.month < date_of_birth.month or (current_date.month == date_of_birth.month and current_date.day < date_of_birth.day):
        age -= 1
    
    return age






# Routes

# API route to register a therapist
@app.route('/api/therapist/signup', methods=['POST'])
def signup_therapist():
    data = request.get_json()

    print('Received data:', data)  # Log received data
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    # Hash password
    hashed_password = generate_password_hash(password)


    # Save therapist to database
    try:
        connection = pool.get_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM Therapist WHERE email = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            cursor.close()
            connection.close()
            print('email already exists')
            return jsonify({"message": "Account with this email already exists."}), 400


        cursor.execute(
            "INSERT INTO Therapist (firstName, email, passwordHash) VALUES (%s, %s, %s)",
            (name, email, hashed_password),
        )
        connection.commit()
        cursor.close()
        print('Therapist registered successfully')

        return jsonify({"message": "Therapist registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# API route to log in a therapist
@app.route('/api/therapist/login', methods=['POST'])
def login_therapist():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    # Authenticate therapist
    try:
        connection = pool.get_connection()
        cursor = connection.cursor()

        # First, fetch the passwordHash from the database
        cursor.execute("SELECT passwordHash FROM Therapist WHERE email = %s", (email,))
        result = cursor.fetchone()

        # If no user found or password doesn't match
        if not result or not check_password_hash(result[0], password):
            cursor.close()
            connection.close()
            return jsonify({"error": "Invalid credentials"}), 401

        # Now, retrieve the name of the therapist (after password verification)
        cursor.execute("SELECT firstName, lastName FROM Therapist WHERE email = %s", (email,))
        result = cursor.fetchone()

        # If name is found, proceed with token creation
        if result:
            # print(result[0] + " " + (result[1] or ""))
            name = result[0] + " " + (result[1] or "")
            role = "therapist"
            # Generate JWT token with the therapist's name
            access_token = create_access_token(
                identity={"name": name, "role": role, "email": email},
                expires_delta=timedelta(minutes=30)  # Expire in 30 minutes
            )
            connection.commit()
            cursor.close()
            return jsonify({"message": "Login successful", "token": access_token}), 200
        else:
            cursor.close()
            connection.close()
            return jsonify({"error": "Therapist not found"}), 404

    except Exception as e:
            cursor.close()
            connection.close()
            return jsonify({"error": str(e)}), 500


# API route to get patients from MySQL database
@app.route('/api/therapist/patients', methods=['GET'])
def get_patients():
    try:
        therapist_email = request.headers.get('Therapist-Email')  # Extract email from the header
        if not therapist_email:
            return jsonify({"error": "Therapist email missing in header"}), 400

        # Use the connection pool to get a connection
        connection = pool.get_connection()

        # Check if the connection was established
        if not connection.is_connected():
            return jsonify({"error": "MySQL connection failed"}), 500

        print("connection established")

        # Create a cursor for the connection
        cursor = connection.cursor(dictionary=True)

        # Query to fetch therapist ID based on the email
        cursor.execute("SELECT therapistID FROM therapist WHERE email = %s", (therapist_email,))
        therapist = cursor.fetchone()

        # If therapist is not found, return an error message
        if not therapist:
            return jsonify({"error": "Therapist not found"}), 404

        therapist_id = therapist['therapistID']
        
        print("Therapist:", therapist_id)

        # Query to fetch patients of the therapist
        cursor.execute("SELECT firstName, patientID FROM patient WHERE assignedTherapist = %s", (therapist_id,))
        patients = cursor.fetchall()

        print("query executed")

        # If no patients found, return an error message
        if not patients:
            return jsonify({"error": "No patients found"}), 404

        # Return the patient data as JSON
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Ensure the cursor and connection are closed after use
        cursor.close()
        connection.close()



# API route to delete a patient by number
@app.route('/api/delete-patient/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        # Create a cursor to interact with the database
        connection = pool.get_connection()
        cursor = connection.cursor()

        print("connection established, id:", patient_id)
        # Delete patient by ID (change query to use patientID)
        query = "DELETE FROM Patient WHERE patientID = %s"
        cursor.execute(query, (patient_id,))

        # Commit the transaction to the database
        connection.commit()

        # Check if any rows were affected (i.e., the patient was deleted)
        if cursor.rowcount == 0:
            return jsonify({"error": "Patient not found"}), 404

        # Close the cursor
        cursor.close()

        # Return success message
        return jsonify({"message": f"Patient with ID {patient_id} deleted successfully."}), 200

    except Exception as e:
        cursor.close()
        connection.close()
        # Handle any exceptions and return an error message
        return jsonify({"error": str(e)}), 500




# API route to get therapist info to display in the therapist home
# @app.route('/auth/therapist/profile', methods=['GET'])
# def therapist_profile():
#     return jsonify({"message": "Therapist profile data here"}), 200




# API route to add a new patient of the therapist
@app.route('/api/therapist/add-patient', methods=['POST'])
def add_patient():
    data = request.get_json()

    # Get the therapist's email from the request header
    therapist_email = request.headers.get('Therapist-Email')  # Extract email from the header
    if not therapist_email:
        return jsonify({"error": "Therapist email missing in header"}), 400

    print(data)

    
    # Get other patient data from the request body
    name = data.get('name')
    patient_email = data.get('email')  # Changed field name to avoid confusion
    password = data.get('password')
    phone = data.get('phone')
    date_of_birth = data.get('dateOfBirth')
    age = calculate_age(date_of_birth)
    # print("Age:", age)

    # first_name = data.get('firstName')
    # last_name = data.get('lastName')
    # gender = data.get('gender')
    # diagnosis = data.get('diagnosis')

    # Validate required fields
    if not all([name, patient_email, password, phone, age]):
        return jsonify({"message": "Missing required fields"}), 400

    # Ensure the therapist exists using the provided email
    try:
        connection = pool.get_connection()
        cursor = connection.cursor()

        # Get therapist ID using the therapist's email
        cursor.execute("SELECT therapistID FROM Therapist WHERE email = %s", (therapist_email,))
        therapist = cursor.fetchone()


        if not therapist:
            cursor.close()
            connection.close()
            return jsonify({"message": "Therapist not found"}), 404

        therapist_id = therapist[0]
        hashed_password = generate_password_hash(password)
        print(therapist_id)
        # Insert the patient details into the Patient table
        cursor.execute(
            "INSERT INTO Patient (firstName, email, passwordHash, age, phoneNumber, assignedTherapist) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (name, patient_email, hashed_password, age, phone, therapist_id),
        )
        connection.commit()
        cursor.close()

        return jsonify({"message": "Patient added successfully"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500




# API route to get patient info to display in the dashboard
# @app.route('/auth/therapist/profile', methods=['GET'])
# def therapist_profile():
#     return jsonify({"message": "Therapist profile data here"}), 200




@app.route('/api/patient/login', methods=['POST'])
def login_patient():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    # Authenticate patient
    try:
        connection = pool.get_connection()
        cursor = connection.cursor()

        # First, fetch the passwordHash from the database
        cursor.execute("SELECT passwordHash FROM Patient WHERE email = %s", (email,))
        result = cursor.fetchone()

        # If no user found or password doesn't match
        if not result or not check_password_hash(result[0], password):
            cursor.close()
            connection.close()
            return jsonify({"error": "Invalid credentials"}), 401

        # Now, retrieve the name of the patient (after password verification)
        cursor.execute("SELECT firstName, lastName FROM Patient WHERE email = %s", (email,))
        result = cursor.fetchone()

        # If name is found, proceed with token creation
        if result:
            name = result[0] + " " + (result[1] or "")
            role = "patient"
            # Generate JWT token with the patient's name
            access_token = create_access_token(identity={"name": name, "role": role})

            connection.commit()
            cursor.close()
            return jsonify({"message": "Login successful", "token": access_token}), 200
        else:
            cursor.close()
            connection.close()
            return jsonify({"error": "Patient not found"}), 404

    except Exception as e:
            cursor.close()
            connection.close()
            return jsonify({"error": str(e)}), 500







# @app.route('/auth/therapist/profile', methods=['GET'])
# @jwt_required()
# def therapist_profile():
#     return jsonify({"message": "Therapist profile data here"}), 200


# API route to get patients from MySQL database
# @app.route('/api/therapist/patients', methods=['GET'])
# def get_patients():
#     try:
#         # Use the connection pool to get a connection
#         connection = pool.get_connection()

#         # Check if the connection was established
#         if not connection.is_connected():
#             return jsonify({"error": "MySQL connection failed"}), 500

#         print("connection established")

#         # Create a cursor for the connection
#         cursor = connection.cursor(dictionary=True)
#         # Query to fetch patient data
#         cursor.execute("SELECT firstName, patientID FROM patient")  
#         patients = cursor.fetchall()  # Get all patients

#         print("query executed")

#         # If no patients found, return an error message
#         if not patients:
#             return jsonify({"error": "No patients found"}), 404

#         # Return the patient data as JSON
#         return jsonify(patients), 200

#     except Exception as e:
#         cursor.close()
#         connection.close()
#         # Return any exceptions as error messages
#         return jsonify({"error": str(e)}), 500




# Run the application
if __name__ == '__main__':
    app.run(debug=True)
