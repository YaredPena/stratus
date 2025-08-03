from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import redis
import os
import pandas as pd
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

df = None
embeddings = None
model = None

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


## user routes ##
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
        return jsonify({'error': 'Incorrect email or password'}), 401

    session['user'] = email
    return jsonify({'message': 'Login successful'}), 200


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    session.modified = True
    return jsonify({'message': 'User Logged Out'}), 200


## rag end point
@app.route("/recommend", methods=["POST"])
def recommend():
    global df, embeddings, model

    if df is None or embeddings is None or model is None:
        print("🔁 Loading model and data files...")
        df = pd.read_pickle("data/laptops.pkl")
        embeddings = np.load("data/laptop_embeddings.npy")
        model = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ Model and data loaded.")

    body = request.get_json() or {}
    query = body.get("query", "").strip()
    if not query:
        return jsonify({"error": "query required!"}), 400

    q_vec = model.encode([query])
    sims = cosine_similarity(q_vec, embeddings)[0]
    top_idx = sims.argsort()[-3:][::-1]

    result = (df.iloc[top_idx][["manufacturer", "model_name", "price_usd"]]
              .rename(columns={"price_usd": "price"})
              .to_dict(orient="records"))
    return jsonify({"recommendations": result})


'''
@app.route("/")
def healthcheck():
    return "backend is running."
'''


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port)
