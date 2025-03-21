from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector.pooling
from deepface import DeepFace
import cv2
import mediapipe as mp
import numpy as np
from statistics import mode
from datetime import datetime
import threading
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure MySQL connection pool
dbconfig = {
    "host": os.getenv("MYSQL_HOST", "localhost"),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "database": os.getenv("MYSQL_DB", "therapease"),
    "pool_name": "mypool",
    "pool_size": 32
}
pool = mysql.connector.pooling.MySQLConnectionPool(**dbconfig)

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

# Start the AI models
# @app.route('/start-model', methods=['GET'])
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
        ai_thread.start()
        return jsonify({"message": "AI models started"}), 200
    else:
        return jsonify({"message": "AI models are already running"}), 400


# Stop the AI models
# @app.route('/stop-model', methods=['GET'])
def stop():
    global processing, ai_thread
    if processing:
        processing = False
        ai_thread.join()  # Wait for the thread to finish
        return jsonify({"message": "AI models stopped"}), 200
    else:
        return jsonify({"message": "No AI models are running"}), 400


# Submit response and get aggregated results
@app.route('/initialize-session', methods=['POST'])
def initialize_session():
    try:
        # Get the request data (patient's email)
        data = request.get_json()
        patient_email = data.get('email')

        # If no email is provided, return an error
        if not patient_email:
            return jsonify({"error": "Email is required"}), 400

        # Connect to the database
        connection = get_db_connection()
        cursor = connection.cursor()

        # Start the AI models after finalizing the session
        start_response = start()  # Call the /stop-model endpoint internally
        if stop_response[1] != 200:
            return jsonify({"error": "Failed to stop AI models"}), 500
        start_time = time.time()



        # Get the patientID from the email (assuming you have a Patient table with email as a field)
        cursor.execute("SELECT patientID FROM Patient WHERE email = %s", (patient_email,))
        result = cursor.fetchone()

        if not result:
            cursor.close()
            connection.close()
            return jsonify({"error": "Patient not found"}), 404

        patientID = result[0]

        # Get current date and time for session creation
        session_date = datetime.now()
        # session_duration = '00:30:00'  # Default duration (this can be updated later)
        # avg_progress_score = 0.00  # Default average progress score (can be updated later)
        # total_correct = 0  # Default value for total correct (can be updated later)

        # Create a new session in the Session table
        cursor.execute("""
            INSERT INTO Session (patientID, date)
            VALUES (%s, %s, %s, %s, %s)
        """, (patientID, session_date))

        # Commit the transaction to the database
        connection.commit()

        # Get the sessionID of the newly created session
        sessionID = cursor.lastrowid

        # Close the database connection
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
        session_id = data['sessionID']
        questionText = data['question']
        user_response = data['response']

        # Aggregate data
        emotion = mode(emotion_list) if emotion_list else "Unknown"
        focus_percent = sum(focus_percent_list) / len(focus_percent_list) if focus_percent_list else 0

        connection = pool.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Get correct answer
        cursor.execute("SELECT correctAnswer FROM Questions WHERE questionID = %s", (question_id,))
        correct_answer = cursor.fetchone()

        if not correct_answer:
            return jsonify({"error": "Invalid questionID"}), 400

        # Check if the answer is correct
        is_correct = (user_response.strip().lower() == correct_answer['correctAnswer'].strip().lower())

        # Save response data with timestamp
        cursor.execute("""
            INSERT INTO SessionDetails (sessionID, questionID, responseText, emotionDetected, blinkCount, focusPercent)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (session_id, question_id, user_response, emotion, blink_count, focus_percent))

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
        session_id = data['sessionID']
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



if __name__ == '__main__':
    app.run(debug=True, threaded=True)


# from fastapi import FastAPI, UploadFile
# from gtts import gTTS
# import os
# from flask import Flask, request, send_file

# # app = FastAPI()
# app = Flask(__name__)

# @app.post("/tts/", methods=["POST"])
# def generate_tts():
#     data = request.get_json()
#     text = data.get("text", "")
    
#     if not text:
#         return {"error": "No text provided"}, 400

#     tts = gTTS(text)
#     tts.save("output.mp3")

#     return send_file("output.mp3", mimetype="audio/mp3")


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=5559, debug = True)






