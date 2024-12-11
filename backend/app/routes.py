from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import get_patient_by_id
from app import mysql

routes_blueprint = Blueprint('routes', __name__)

@routes_blueprint.route('/therapist/patients', methods=['GET'])
@jwt_required()
def get_patients():
    identity = get_jwt_identity()
    therapist_id = identity["user_id"]

    cursor = mysql.connection.cursor()
    query = "SELECT * FROM Patient WHERE assignedTherapist = %s"
    cursor.execute(query, (therapist_id,))
    patients = cursor.fetchall()
    cursor.close()

    return jsonify({"patients": patients}), 200

@routes_blueprint.route('/therapist/add-patient', methods=['POST'])
@jwt_required()
def add_patient():
    data = request.json
    name = data["name"]
    age = data["age"]
    diagnosis = data["diagnosis"]
    therapist_id = get_jwt_identity()["user_id"]

    cursor = mysql.connection.cursor()
    query = "INSERT INTO Patient (name, age, diagnosis, assignedTherapist) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (name, age, diagnosis, therapist_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Patient added successfully!"}), 201
