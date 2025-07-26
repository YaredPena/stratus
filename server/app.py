from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import redis
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

redis_client = redis.Redis.from_url(os.environ["REDIS_URL"], decode_responses=True)

app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis_client
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'session:'
app.config['SESSION_SERIALIZER'] = 'json'
Session(app)

CORS(
    app,
    origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    supports_credentials=True
)

def email_key(email: str) -> str:
    return f"user:{email}"

@app.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    data = request.get_json() or {}
    first_name = data.get('firstname')
    last_name = data.get('lastname')
    email = data.get('email')
    password = data.get('password')

    if not first_name or not last_name:
        return jsonify({'error': 'firstname and lastname required'}), 400

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    if redis_client.exists(email_key(email)):
        return jsonify({'error': 'User already exists'}), 409

    pass_hash = generate_password_hash(password)
    redis_client.hset(email_key(email), mapping={
        "email": email,
        "password": pass_hash
    })

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    key = email_key(email)
    if not redis_client.exists(key):
        return jsonify({'error': 'Invalid credentials'}), 401

    stored_hash = redis_client.hget(key, "password")
    if not check_password_hash(stored_hash, password):
        return jsonify({'error': 'Incorrect email or password'}), 401

    session['user'] = email
    return jsonify({'message': 'Login successful'}), 200

@app.route('/logout', methods=['POST', 'OPTIONS'])
def logout():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    session.clear()
    return jsonify({'message': 'User Logged Out'}), 200

if __name__ == '__main__':
    app.run(debug=True)