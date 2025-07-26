from flask import Flask, request, jsonify, session
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
import redis
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret")

## established redis
redis_client = redis.Redis.from_url(os.environ["REDIS_URL"], decode_responses=True)

## session store: redis
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_REDIS"] = redis_client
app.config["SESSION_PERMANENT"] = False
Session(app)

## redis key for my email.
def email_key(email: str) -> str:
    ## my email@email.com <-- string input
    ## returning str output --> the email itself.
    return f"user:{email}" 

@app.route('/signup', methods=['POST'])
def signup():
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

@app.route('/login', methods=['POST'])
def login():
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
        return jsonify({'error': 'Invalid credentials'}), 401

    session['user'] = email
    return jsonify({'message': 'Login successful'}), 200


'''
debating on if I need this.... I can clear sessions client side.
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200
'''

if __name__ == '__main__':
    app.run(debug=True)
