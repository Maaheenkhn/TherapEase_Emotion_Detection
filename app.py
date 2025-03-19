import cv2
from deepface import DeepFace
from flask import Flask, Response, render_template, jsonify
import threading

app = Flask(__name__)

current_emotion = "Unknown"

def detect_emotion(frame):
    global current_emotion
    try:
        results = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        if isinstance(results, list):
            current_emotion = results[0]['dominant_emotion']
        else:
            current_emotion = results['dominant_emotion']
    except Exception as e:
        current_emotion = "Unknown"
        print(f"Emotion detection failed: {e}")

def gen_frames():
    cap = cv2.VideoCapture(0)  

    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break

        detect_emotion(frame)

        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            print("Failed to encode frame.")
            break

        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/emotion_feed')
def emotion_feed():
    def generate_emotion():
        while True:
            yield f"data: {current_emotion}\n\n"
            threading.Event().wait(1)  

    return Response(generate_emotion(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
