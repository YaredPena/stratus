import os
import pandas as pd
import requests
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv(override=True)
api_key = os.getenv("OPENAI_API_KEY")

def get_idr_to_usd():
    try:
        r = requests.get("https://open.er-api.com/v6/latest/IDR", timeout=10)
        data = r.json()
        return data["rates"]["USD"]
    except Exception:
        print("Falling back to static rate 1 USD = 15000 IDR")
        return 15000

def normalize_price(series):
    s = pd.to_numeric(series, errors='coerce')
    med = s.median()
    if med > 1e6:
        fx = get_idr_to_usd()
        return (s / fx).round(2), f"IDR→USD (/{fx})"
    elif med > 10000:  
        return (s / 100).round(2), "cents→USD (/100)"
    else:
        return s.round(2), "looks like USD already"

df = pd.read_csv("data/laptops_train.csv")
df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
df = df.fillna("Unknown")

df['price'] = pd.to_numeric(df['price'], errors='coerce')
df['price_usd'], rule = normalize_price(df['price'])
print("Applied rule:", rule)
print(df['price_usd'].describe())

df['description'] = df.apply(
    lambda row: (
        f"{row['manufacturer']} {row['model_name']} ({row['category']}) "
        f"with {row['cpu']}, {row['ram']} RAM, {row['storage']} storage, "
        f"{row['gpu']} GPU, priced at ${row['price_usd']}"
    ),
    axis=1
)

embeddings = OpenAIEmbeddings(
     model="text-embedding-3-small", 
     api_key=os.getenv("OPENAI_API_KEY"))

vectorstore = Chroma.from_texts(
    texts=df['description'].tolist(),
    embedding=embeddings,
    metadatas=df.to_dict(orient="records"),
    persist_directory="data/chroma"
)
print("Data embedded & saved to Chroma")