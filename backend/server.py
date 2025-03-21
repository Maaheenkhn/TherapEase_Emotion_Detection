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
import time
from deepface import DeepFace
import cv2
import mediapipe as mp
import numpy as np
from statistics import mode
import threading


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



# ------------------ THERAPIST ---------------------


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

        # Check if the email already exists in the database
        cursor.execute("SELECT COUNT(*) FROM Therapist WHERE email = %s", (email,))
        result = cursor.fetchone()

        # If the email exists, return an error message
        if result[0] > 0:
            return jsonify({"message": "Email is already in use"}), 400

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
    print(data)

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
        cursor.execute("SELECT firstName, lastName, patientID FROM patient WHERE assignedTherapist = %s", (therapist_id,))
        patients = cursor.fetchall()

        print("query executed")

        # If no patients found, return an empty response
        if not patients:
            return jsonify([]), 200

        # Combine firstName and lastName, and create a new list of patient info
        patient_info_list = []
        for patient in patients:
            full_name = patient["firstName"] + " " + (patient["lastName"] or "")  # Combine firstName and lastName
            patient_info_list.append({
                "firstName": full_name.strip(),  # Remove extra spaces if lastName is None
                "patientID": patient["patientID"]
            })

        # Return the patient data as JSON
        return jsonify(patient_info_list), 200
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





@app.route('/api/therapist/get-data', methods=['POST'])
def get_therapist_data():
    try:
        # Get the JSON data from the request body
        data = request.get_json()
        therapist_email = data.get('email')

        # Ensure that the email is provided
        if not therapist_email:
            return jsonify({"error": "Email is required"}), 400

        connection = pool.get_connection()
        cursor = connection.cursor()

        print('connection done', therapist_email)

        # Query the database to get the therapist's data using the provided email
        cursor.execute("SELECT firstName, lastName, email, passwordHash FROM Therapist WHERE email = %s", (therapist_email,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "Therapist not found"}), 404

        # Extract the result into a dictionary
        therapist_data = {
            "firstName": result[0],
            "lastName": result[1],
            "email": result[2],
            "password": "••••••••"  # You might want to exclude the password from the response for security reasons
        }

        print(therapist_data)
        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify(therapist_data), 200

    except Exception as e:
        # Handle any exceptions (database or JWT related)
        return jsonify({"error": str(e)}), 500


# API route to update therapist info
@app.route('/api/therapist/update-profile', methods=['POST'])
def update_therapist_profile():
    # Get data from the request
    data = request.get_json()
    email = data.get('email')
    first_name = data.get('firstName')
    last_name = data.get('lastName')

    # Ensure required fields are provided
    if not all([email, first_name, last_name]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        connection = pool.get_connection()
        cursor = connection.cursor()

        # Check if therapist exists with the provided email
        cursor.execute("SELECT * FROM Therapist WHERE email = %s", (email,))
        therapist = cursor.fetchone()

        if not therapist:
            return jsonify({"error": "Therapist not found"}), 404

        cursor.execute("""
            UPDATE Therapist
            SET firstName = %s, lastName = %s
            WHERE email = %s
        """, (first_name, last_name, email))

        # Commit the transaction
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({"message": "Profile updated successfully!"}), 200

    except Exception as e:
        # Handle any exception that occurs
        return jsonify({"error": str(e)}), 500


# API route to update therapist password
@app.route('/api/therapist/update-password', methods=['POST'])
def update_password():
    data = request.get_json()

    email = data.get('email')
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if not all([email, old_password, new_password]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        connection = pool.get_connection()
        cursor = connection.cursor()

        # Check if therapist exists with the provided email
        cursor.execute("SELECT passwordHash FROM Therapist WHERE email = %s", (email,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "Therapist not found"}), 404

        # Check if the old password matches
        if not check_password_hash(result[0], old_password):
            return jsonify({"error": "Cuurent password is incorrect"}), 401

        # Hash the new password
        hashed_new_password = generate_password_hash(new_password)

        # Update the password in the database
        cursor.execute("""
            UPDATE Therapist
            SET passwordHash = %s
            WHERE email = %s
        """, (hashed_new_password, email))

        # Commit the transaction
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({"message": "Password updated successfully!"}), 200

    except Exception as e:
        # Handle any exception that occurs
        return jsonify({"error": str(e)}), 500


# API route to add a new patient of the therapist
@app.route('/api/therapist/add-patient', methods=['POST'])
def add_patient():
    data = request.get_json()

    # Get the therapist's email from the request header
    therapist_email = request.headers.get('Therapist-Email')  # Extract email from the header
    if not therapist_email:
        return jsonify({"message": "Therapist email missing in header"}), 400

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

        
    # Validate age of patients
    if age < 11:
        return jsonify({"message": "Patient is not old enough"}), 400

    # Validate required fields
    if not all([name, patient_email, password, phone, age]):
        return jsonify({"message": "Missing required fields"}), 400

    # Ensure the therapist exists using the provided email
    try:
        connection = pool.get_connection()
        cursor = connection.cursor()

        # Check if the email already exists in the database
        cursor.execute("SELECT COUNT(*) FROM Patient WHERE email = %s", (patient_email,))
        result = cursor.fetchone()

        # If the email exists, return an error message
        if result[0] > 0:
            return jsonify({"message": "Email is already in use"}), 400

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


def calculate_score(correct_answer, user_answer, difficulty, emotion, blink_count, focus_percent):
    # Base score for correctness
    if user_answer == correct_answer:
        correctness_score = 1.0
    else:
        correctness_score = 0.0

    # Difficulty multiplier
    if difficulty == 'easy':
        difficulty_multiplier = 1.0
    elif difficulty == 'medium':
        difficulty_multiplier = 1.5
    elif difficulty == 'hard':
        difficulty_multiplier = 2.0
    else:
        difficulty_multiplier = 1.0

    # Emotion adjustment
    if emotion in ['happy', 'neutral','surprised']:
        emotion_adjustment = 1.1
    else:
        emotion_adjustment = 0.9

    # Blink count adjustment
    if blink_count < 10:
        blink_adjustment = 1.05
    else:
        blink_adjustment = 0.95

    # Focus percentage adjustment
    focus_adjustment = 1 + (focus_percent - 50) / 100

    # Calculate final score
    score = correctness_score * difficulty_multiplier * emotion_adjustment * blink_adjustment * focus_adjustment

    return (score/3.465)*10


@app.route('/api/dashboard/<patient_number>', methods=['GET'])
def get_patient_data(patient_number):
    try:
        # Create the connection
        connection = pool.get_connection()

        if not connection.is_connected():
            return jsonify({"error": "MySQL connection failed"}), 500

        cursor = connection.cursor(dictionary=True)

        # Fetch patient general info
        cursor.execute("SELECT firstName, lastName, age, patientID FROM Patient WHERE patientID = %s", (patient_number,))
        patient_info = cursor.fetchone()

        name = patient_info["firstName"] + " " + (patient_info["lastName"] or "")

        if not patient_info:
            return jsonify({"error": "Patient not found"}), 404

        # Fetch session data
        cursor.execute("""
            SELECT sessionID, totalCorrect, avgProgressScore, date
            FROM Session
            WHERE patientID = (SELECT patientID FROM Patient WHERE patientID = %s)
        """, (patient_number,))
        sessions = cursor.fetchall()

        # get duration and avgprogressscore
        cursor.execute("""
            SELECT sessionID, duration, avgProgressScore
            FROM Session
            WHERE patientID = %s
        """, (patient_number,))
        session_duration_score = cursor.fetchall()

        print("session_duration_score:", session_duration_score)

        # Calculate the average totalCorrect score
        if sessions:
            try:
                avg_total_correct = sum([session['totalCorrect'] for session in sessions if session['totalCorrect'] is not None]) / len([session for session in sessions if session['totalCorrect'] is not None])
            except Exception as e:
                print(f"Error calculating avg_total_correct: {e}")
                avg_total_correct = 0
        else:
            avg_total_correct = 0

        # Calculate the average progress score and average duration
        if session_duration_score:
            try:
                # Filter out None values for avgProgressScore and duration
                valid_progress_scores = [float(session['avgProgressScore']) for session in session_duration_score if session['avgProgressScore'] is not None]
                valid_durations = [session['duration'].total_seconds() for session in session_duration_score if session['duration'] is not None]

                # Calculate the average of valid progress scores
                avg_progress_score = sum(valid_progress_scores) / len(valid_progress_scores) if valid_progress_scores else 0

                # Calculate the average duration
                total_duration_seconds = sum(valid_durations)
                avg_duration_seconds = total_duration_seconds / len(valid_durations) if valid_durations else 0

            except Exception as e:
                print(f"Error calculating avg_progress_score or avg_duration: {e}")
                avg_progress_score = 0
                avg_duration_seconds = 0
        else:
            avg_progress_score = 0
            avg_duration_seconds = 0

        # get emotionDetected, blinkCount and focusPercent
        session_data = []
        for session in sessions:
            sessionID = session['sessionID']  # Use the correct key to get sessionID
            cursor.execute("""
                SELECT emotionDetected, blinkCount, focusPercent
                FROM SessionDetails
                WHERE sessionID = %s
            """, (sessionID,))
            details = cursor.fetchall()
            session_data.append((sessionID, details))

        # emotion scale
        emotion_scale = {
            "Anger": 1,
            "Fear": 2,
            "Sadness": 3,
            "Neutral": 4,
            "Surprise": 5,
            "Happiness": 6
        }

        # Initialize variables for emotion and focus data
        emotion_data = []
        focus_data = []

        for sessionID, details in session_data:
            for detail in details:
                # Get emotion and convert it to the corresponding scale value
                emotion = detail['emotionDetected']
                if emotion in emotion_scale:
                    emotion_data.append(emotion_scale[emotion])

                # Collect focus data (which is actually blink count in this case)
                focus_data.append(detail['focusPercent'])

        # Calculate average emotion value and average focus percent
        avg_emotion = sum(emotion_data) / len(emotion_data) if emotion_data else 0
        avg_focus = sum(focus_data) / len(focus_data) if focus_data else 0

        # Print the results
        print(f"Average Total Correct: {avg_total_correct}")
        print(f"Average Progress Score: {avg_progress_score}")
        print(f"Average Duration (in seconds): {avg_duration_seconds}")
        print(f"Average Emotion: {avg_emotion}")
        print(f"Average Focus Percent: {avg_focus}")

        # Scaling progress score and focus percent
        scaled_progress_score = avg_progress_score / 10
        scaled_focus_percent = avg_focus / 10

        # Scaling emotion
        scaled_emotion = (avg_emotion / 6) * 10  # Convert from 1-6 scale to 0-10 scale
        scaled_emotion = max(0, min(10, scaled_emotion))  # Ensure it stays between 0 and 10

        # Scaling duration
        min_duration = 10
        max_duration = 900
        scaled_duration = ((avg_duration_seconds - min_duration) / (max_duration - min_duration)) * 10
        scaled_duration = max(0, min(10, scaled_duration))  # Ensure it stays between 0 and 10

        # Print the scaled results
        print(f"Scaled Progress Score: {scaled_progress_score}")
        print(f"Scaled Focus Percent: {scaled_focus_percent}")
        print(f"Scaled Emotion: {scaled_emotion}")
        print(f"Scaled Duration: {scaled_duration}")

        performance_data = [
            {"subject": "Focus", "value": scaled_focus_percent},
            {"subject": "Emotion", "value": scaled_emotion},
            {"subject": "Accuracy", "value": avg_total_correct},
            {"subject": "Session Score", "value": scaled_progress_score},
            {"subject": "Time Taken", "value": scaled_duration}
        ]

        response = {
            "name": name,
            "age": patient_info["age"],
            "mrn": patient_number,
            "sessions": sessions,
            "performanceData": performance_data
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()



# ------------------ PATIENT ---------------------



# API route to log in a patient
@app.route('/api/patient/login', methods=['POST'])
def login_patient():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(data)

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

        # Explicitly call fetchall() to clear any unread results from the first query
        cursor.fetchall() #more than one patient with same credential

        # If name is found, proceed with token creation
        if result:
            # print(result[0] + " " + (result[1] or ""))
            name = result[0] + " " + (result[1] or "")
            role = "patient"
            # Generate JWT token with the patient's name
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
            return jsonify({"error": "Patient not found"}), 404

    except Exception as e:
            cursor.close()
            connection.close()
            return jsonify({"error": str(e)}), 500


# Initialize mediapipe face mesh and face detection
mp_face_mesh = mp.solutions.face_mesh
mp_face_detection = mp.solutions.face_detection
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=1)
face_detection = mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)

# Global variables for AI processing
processing = False
emotion_list = []
focus_percent_list = []
blink_count = 0
cap = None
ai_thread = None
start_time = 0

# Function to detect emotion using DeepFace
def detect_emotion(image):
    try:
        analysis = DeepFace.analyze(image, actions=["emotion"], enforce_detection=False)
        return analysis[0].get("dominant_emotion", "Unknown")
    except Exception:
        return "Unknown"

# Function to detect blink using mediapipe
def detect_blink(face_landmarks):
    left_eye_indices = [362, 385, 387, 263, 373, 380]
    right_eye_indices = [33, 160, 158, 133, 153, 144]
    
    def calculate_ear(landmarks, eye_indices):
        eye = np.array([[landmarks[i].x, landmarks[i].y] for i in eye_indices])
        v1 = np.linalg.norm(eye[1] - eye[5])
        v2 = np.linalg.norm(eye[2] - eye[4])
        h = np.linalg.norm(eye[0] - eye[3])
        return (v1 + v2) / (2.0 * h)
    
    left_ear = calculate_ear(face_landmarks.landmark, left_eye_indices)
    right_ear = calculate_ear(face_landmarks.landmark, right_eye_indices)
    return (left_ear + right_ear) / 2.0

# Function to process each frame
def process_frame(frame):
    global emotion_list, focus_percent_list, blink_count
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_results = face_mesh.process(rgb_frame)
    detection_results = face_detection.process(rgb_frame)
    
    emotion = "Unknown"
    focus_percentage = 100
    
    if detection_results.detections:
        for detection in detection_results.detections:
            bboxC = detection.location_data.relative_bounding_box
            h, w, _ = frame.shape
            x, y, w_box, h_box = (int(bboxC.xmin * w), int(bboxC.ymin * h), int(bboxC.width * w), int(bboxC.height * h))
            face_roi = frame[y:y + h_box, x:x + w_box]
            if face_roi.shape[0] > 0 and face_roi.shape[1] > 0:
                emotion = detect_emotion(face_roi)
                emotion_list.append(emotion)
    
    if face_results.multi_face_landmarks:
        for face_landmarks in face_results.multi_face_landmarks:
            avg_ear = detect_blink(face_landmarks)
            if avg_ear < 0.21:
                blink_count += 1
    
    focus_percent_list.append(focus_percentage)
    return emotion, blink_count, focus_percentage

# Function to continuously capture and process frames
def start_processing():
    global processing, cap, emotion_list, focus_percent_list, blink_count
    processing = True
    cap = cv2.VideoCapture(0)
    
    while processing:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Process the frame
        process_frame(frame)
        
        # Delay to reduce CPU usage
        time.sleep(0.1)
    
    # Release resources when processing stops
    cap.release()
    cv2.destroyAllWindows()


# # Global variables
# processing = False
# ai_thread = None





# Start the AI models
def start():
    global processing, ai_thread
    if not processing:
        # Reset data lists
        emotion_list.clear()
        focus_percent_list.clear()
        global blink_count
        blink_count = 0
        
        # Start the processing in a new thread
        ai_thread = threading.Thread(target=start_processing)
        ai_thread.daemon = True  # Allow the thread to exit when the main thread exits
        ai_thread.start()
        processing = True
        return jsonify({"message": "AI models started"}), 200
    else:
        return jsonify({"message": "AI models are already running"}), 400


# Stop the AI models
def stop():
    global processing, ai_thread
    if processing:
        processing = False
        # Instead of waiting for the thread to finish, just stop the process gracefully
        stop_processing()  # Implement this function to stop the task gracefully
        return jsonify({"message": "AI models stopped"}), 200
    else:
        return jsonify({"message": "No AI models are running"}), 400

# Example of gracefully stopping the processing (you need to implement this)
def stop_processing():
    global processing
    # Logic to stop AI models gracefully, such as signaling the thread to stop.
    print("Stopping AI models...")

    global processing, ai_thread
    if processing:
        processing = False
        ai_thread.join()  # Wait for the thread to finish
        return jsonify({"message": "AI models stopped"}), 200
    else:
        return jsonify({"message": "No AI models are running"}), 400


@app.route('/initialize-session', methods=['POST'])
def initialize_session():
    print('sent')
    try:
        data = request.get_json()
        patient_email = data.get('email')

        if not patient_email:
            return jsonify({"error": "Email is required"}), 400

        # Connect to the database
        try:
            connection = pool.get_connection()
            cursor = connection.cursor()
            print("Database connected successfully")
        except Exception as e:
            print(f"Error connecting to database: {str(e)}")
            return jsonify({"error": "Database connection failed"}), 500

        # Start the AI models after finalizing the session
        start_response = start()
        if start_response[1] != 200:
            print("Failed to start AI models:", start_response)
            return jsonify({"error": "Failed to start AI models"}), 500
        
        # start_time = time.time()
        global start_time  # Accessing the global variable
        start_time = time.time()

        # Get the patientID from the email
        cursor.execute("SELECT patientID FROM Patient WHERE email = %s", (patient_email,))
        result = cursor.fetchone()

        if not result:
            cursor.close()
            connection.close()
            print("Patient not found for email:", patient_email)
            return jsonify({"error": "Patient not found"}), 404

        patientID = result[0]
        print('patientID', patientID)

        session_date = datetime.now()

        # Create a new session in the Session table
        cursor.execute("""
            INSERT INTO Session (patientID, date)
            VALUES (%s, %s)
        """, (patientID, session_date))

        # Commit the transaction to the database
        connection.commit()

        # Get the sessionID of the newly created session
        sessionID = cursor.lastrowid
        print('sessionID', sessionID)

        cursor.close()
        connection.close()

        # Return the sessionID as the response
        return jsonify({"message": "Session initialized successfully", "sessionID": sessionID}), 200

    except Exception as e:
        print(f"Error initializing session: {str(e)}")
        return jsonify({"error": "An error occurred while initializing session"}), 500

# Submit response and get aggregated results
@app.route('/submit-response', methods=['POST'])
def submit_response():
    global emotion_list, focus_percent_list, blink_count
    try:
        data = request.json
        print(data)
        session_id = data['session_id']
        questionText = data['question']
        user_response = data['response']

        # Aggregate data
        emotion = mode(emotion_list) if emotion_list else "Unknown"
        focus_percent = sum(focus_percent_list) / len(focus_percent_list) if focus_percent_list else 0

        connection = pool.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Get correct answer
        cursor.execute("SELECT questionID, correctAnswer FROM Questions WHERE questionText = %s", (questionText,))
        correct_answer = cursor.fetchone()

        if not correct_answer:
            return jsonify({"error": "Invalid questionID"}), 400

        # Check if the answer is correct
        is_correct = (user_response.strip().lower() == correct_answer['correctAnswer'].strip().lower())

        # Save response data with timestamp
        cursor.execute("""
            INSERT INTO SessionDetails (sessionID, questionID, responseText, emotionDetected, blinkCount, focusPercent)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (session_id, correct_answer['questionID'], user_response, emotion, blink_count, focus_percent))

        connection.commit()
        cursor.close()
        connection.close()

        # Prepare the response with final values
        response_data = {
            "message": "Response recorded",
            "isCorrect": is_correct,
            "emotionDetected": emotion,
            "blinkCount": blink_count,
            "focusPercent": focus_percent
        }

        # Reset data lists for the next question
        emotion_list.clear()
        focus_percent_list.clear()
        blink_count = 0

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Finalize session
@app.route('/finalize-session', methods=['POST'])
def finalize_session():
    try:
        data = request.json
        session_id = data['sessionId']
        end_time = datetime.now()

        connection = pool.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Get start time
        cursor.execute("SELECT date FROM Session WHERE sessionID = %s", (session_id,))
        session_data = cursor.fetchone()

        if not session_data:
            return jsonify({"error": "Session not found"}), 400

        # start_time = session_data['date']
        # total_time = end_time - start_time 
        global start_time  # Accessing the global variable
        end_time = time.time()
        total_time = end_time - start_time - 12



        # Get total correct answers
        cursor.execute("""
            SELECT COUNT(*) AS totalCorrect FROM SessionDetails sd
            JOIN Questions q ON sd.questionID = q.questionID
            WHERE sd.sessionID = %s AND LOWER(sd.responseText) = LOWER(q.correctAnswer)
        """, (session_id,))
        correct_count = cursor.fetchone()["totalCorrect"]

        # Update session data
        cursor.execute("""
            UPDATE Session
            SET duration = %s, totalCorrect = %s
            WHERE sessionID = %s
        """, (total_time, correct_count, session_id))

        connection.commit()
        cursor.close()
        connection.close()

        # Stop the AI models after finalizing the session
        stop_response = stop()  # Call the /stop-model endpoint internally
        if stop_response[1] != 200:

            return jsonify({"error": "Failed to stop AI models"}), 500

        return jsonify({
            "message": "Session finalized",
            "totalTime": str(total_time),
            "totalCorrect": correct_count
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500









# Run the application
if __name__ == '__main__':
    app.run(debug=True, threaded=True)  




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


