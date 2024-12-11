import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Retrieve database credentials from environment variables
db_host = os.getenv("MYSQL_HOST", "127.0.0.1")  # Default to 127.0.0.1 if not set
db_name = os.getenv("MYSQL_DB")
db_user = os.getenv("MYSQL_USER")
db_password = os.getenv("MYSQL_PASSWORD")

# Print the connection details (excluding the password for security reasons)
print(f"Connecting to database with the following details:")
print(f"Host: {db_host}")
print(f"Database Name: {db_name}")
print(f"User: {db_user}")
# Never print the password in a real application
print("Password: [hidden for security reasons]")

connection = None  # Define the connection variable beforehand

try:
    # Attempt to connect to the MySQL database
    connection = mysql.connector.connect(
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_password
    )
    print("Database connection successful!")

    # Create a cursor and execute a test query
    cursor = connection.cursor()
    cursor.execute("SELECT 1")
    cursor.fetchone()

except mysql.connector.Error as e:
    print(f"Error connecting to database: {e}")
finally:
    if connection and connection.is_connected():
        connection.close()
        print("MySQL connection is closed")
