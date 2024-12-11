from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling

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
    "pool_size": 10
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


# Routes
@app.route('/therapist/signup', methods=['POST'])
def signup_therapist():
    data = request.get_json()
    name = data.get('name')
    qualification = data.get('qualification')
    experience_years = data.get('experienceYears')
    username = data.get('username')
    password = data.get('password')

    if not all([name, qualification, experience_years, password]):
        return jsonify({"error": "Missing required fields"}), 400

    # Hash password
    hashed_password = generate_password_hash(password)

    # Save therapist to database
    try:
        connection = pool.get_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO Therapist (name, qualification, experienceYears, username, passwordHash) VALUES (%s, %s, %s, %s, %s)",
            (name, qualification, experience_years, username, hashed_password),
        )
        connection.commit()
        cursor.close()
        return jsonify({"message": "Therapist registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/therapist/login', methods=['POST'])
def login_therapist():
    data = request.get_json()
    name = data.get('name')
    password = data.get('password')

    if not all([name, password]):
        return jsonify({"error": "Missing required fields"}), 400

    # Authenticate therapist
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT password FROM Therapist WHERE name = %s", (name,)
        )
        result = cursor.fetchone()
        cursor.close()

        if result and check_password_hash(result[0], password):
            # Generate JWT token
            access_token = create_access_token(identity={"name": name})
            return jsonify({"message": "Login successful", "token": access_token}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/auth/therapist/profile', methods=['GET'])
@jwt_required()
def therapist_profile():
    return jsonify({"message": "Therapist profile data here"}), 200


# Run the application
if __name__ == '__main__':
    app.run(debug=True)
