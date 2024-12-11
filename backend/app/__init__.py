# from flask import Flask
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# from flask_mysqldb import MySQL
# import os
# from dotenv import load_dotenv

# # Initialize extensions
# mysql = MySQL()
# jwt = JWTManager()
# load_dotenv()

# def create_app():
#     app = Flask(__name__)

#     # Load environment variables
#     app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST", "localhost")
#     app.config['MYSQL_USER'] = os.getenv("MYSQL_USER", "root")
#     app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD", "")
#     app.config['MYSQL_DB'] = os.getenv("MYSQL_DB", "therapease")
#     app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "your_secret_key")

#     # Initialize MySQL
#     try:
#         mysql.init_app(app)
#         with app.app_context():
#             connection = mysql.connection
#             print("Database connected successfully")
#     except Exception as e:
#         print("Database connection failed:", e)

#     # Initialize JWT
#     jwt.init_app(app)

#     # Enable CORS for all routes
#     CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

#     # Register blueprints
#     from app.auth import auth_blueprint
#     from app.routes import routes_blueprint
#     app.register_blueprint(auth_blueprint, url_prefix='/auth')  # Authentication routes
#     app.register_blueprint(routes_blueprint, url_prefix='/api')  # Application routes

#     return app

