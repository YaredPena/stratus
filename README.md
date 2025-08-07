<p align="center">
  <img src="assets/stratus-logo.svg" width="420" alt="Stratus logo" />
</p>

<h2>TECH STACK:</h2> <br>

![Next JS](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) 
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) 
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 
![Python](https://img.shields.io/badge/python-%233776AB.svg?style=for-the-badge&logo=python&logoColor=white)

<h2>THE WEBSITE:</h2>
<img width="1437" height="708" alt="Screenshot 2025-08-06 at 3 27 03 PM" src="https://github.com/user-attachments/assets/34f15cf3-a755-4787-934b-796e662fa36f" />

<h2>THE GOAL:</h2>
<p> Are you looking for a laptop but can't pin down what brand or model fits you best? Stratus was built to help users receive quality recommendations based on their personal needs, without digging through endless reviews or spec lists. </p>

<h2>CORE FUNCTIONALITIES:</h2>
<p>
- 🔐 **User Authentication**: Users can sign up, log in, and log out securely with Redis-backed sessions.<br>
- 🔍 **RAG-based AI Recommendations**: Stratus uses a Sentence Transformer model to provide personalized laptop suggestions using semantic search.<br>
- ⚡ **Fullstack Integration**: Next.js for the frontend, Flask + Redis for backend processing and stateful sessions.<br>
- 📦 **Model-backed Inference**: Embeddings and product data are pre-loaded for instant response.
</p>

<h2>AI STORYTELLING:</h2>
<p>
Stratus uses the "all-MiniLM-L6-v2" transformer model to encode both user queries and laptop data. It calculates cosine similarity between query and product embeddings to return the top 3 matches. This approach mimics personalized search while keeping inference fast and efficient.
</p>

<h2>QUICK START:</h2>

<h3>🔧 PREREQUISITES:</h3>
- Python 3.11+
- Node.js 18+
- Redis (cloud or local)

<h4>1. CLONE:</h4>

```bash
git clone https://github.com/YaredPena/stratus.git
cd stratus
```

<h4>2. VENV:</h4>

```bash
cd server
python -m venv venv
source venv/bin/activate | (Windows: .\venv\Scripts\activate)
```

<h4>3. DEPENDENCIES:</h4>
pip install -r requirements.txt

<h4>4. ENV CONFIG:</h4>
<p>REDIS_URL= your_redis_url</p>
<p>SECRET_KEY= your_flask_secret_key</p>

<h4>5. DATABASE SETUP:</h4>
Ensure the following files are present in the data/ folder:
    <p>-laptops.pkl</p>
    <p>-laptop_embeddings.npy</p>

<h4>6. RUN THE APPLICATION:</h4>

```bash
gunicorn app:app --bind 0.0.0.0:5000
```
<p> FOR FRONTEND </p>

```bash
cd ../client
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```
