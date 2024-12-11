# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import create_access_token
# from app import mysql
# from flask_bcrypt import Bcrypt

# bcrypt = Bcrypt()
# auth_blueprint = Blueprint('auth', __name__)

# @auth_blueprint.route('/therapist/signup', methods=['POST'])
# def therapist_signup():
#     data = request.json
#     name = data["name"]
#     qualification = data["qualification"]
#     experience = data["experienceYears"]
#     raw_password = data["password"]

#     # Hash the password
#     hashed_password = bcrypt.generate_password_hash(raw_password).decode('utf-8')

#     cursor = mysql.connection.cursor()
#     query = "INSERT INTO Therapist (name, qualification, experienceYears, password) VALUES (%s, %s, %s, %s)"
#     cursor.execute(query, (name, qualification, experience, hashed_password))
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({"message": "Therapist registered successfully!"}), 201

# @auth_blueprint.route('/therapist/login', methods=['POST'])
# def therapist_login():
#     data = request.json
#     email = data["email"]
#     raw_password = data["password"]

#     cursor = mysql.connection.cursor()
#     query = "SELECT therapistID, password FROM Therapist WHERE email=%s"
#     cursor.execute(query, (email,))
#     user = cursor.fetchone()
#     cursor.close()

#     if user:
#         user_id, stored_password = user

#         # Verify the hashed password
#         if bcrypt.check_password_hash(stored_password, raw_password):
#             access_token = create_access_token(identity={"user_id": user_id, "role": "therapist"})
#             return jsonify({"access_token": access_token}), 200
#         else:
#             return jsonify({"error": "Invalid credentials"}), 401
#     else:
#         return jsonify({"error": "User not found"}), 404
