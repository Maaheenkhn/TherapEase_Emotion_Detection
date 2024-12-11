from app import mysql

def get_patient_by_id(patient_id):
    cursor = mysql.connection.cursor()
    query = "SELECT * FROM Patient WHERE patientID = %s"
    cursor.execute(query, (patient_id,))
    patient = cursor.fetchone()
    cursor.close()
    return patient
