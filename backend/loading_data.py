import json
import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MySQL connection pool configuration
dbconfig = {
    "host": os.getenv("MYSQL_HOST", "localhost"),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "database": os.getenv("MYSQL_DB", "therapease"),
    "pool_name": "mypool",
    "pool_size": 32
}

# Create the connection pool
pool = mysql.connector.pooling.MySQLConnectionPool(**dbconfig)

# Read the JSON file
with open('../data/questions.json', 'r', encoding='utf-8') as file:
    questions = json.load(file)

# Establish a connection from the pool
connection = pool.get_connection()
cursor = connection.cursor()

# Iterate over the questions and insert them into the database
for question in questions:
    questionText = question['Question']
    A = question['A']
    B = question['B']
    C = question['C']
    D = question['D']
    correctAnswer = question['Correct Answer']
    difficulty = question['Difficulty']

    # SQL query to insert data into Questions table
    insert_query = """
    INSERT INTO Questions (questionText, A, B, C, D, correctAnswer, difficulty)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = (questionText, A, B, C, D, correctAnswer, difficulty)

    try:
        # Execute the insert query
        cursor.execute(insert_query, values)

    except Exception as e:
        print(f"Error inserting question: {str(e)}")
        continue  # If there's an error with one question, skip it and continue

# Commit the changes to the database
connection.commit()

# Close the cursor and connection
cursor.close()
connection.close()

print("Questions inserted successfully!")
