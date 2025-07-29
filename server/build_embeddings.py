import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity 

df = pd.read_csv("data/laptops_train.csv")

print("Original columns:", list(df.columns))

### cleaning column names, they had '_storage'
df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

print("Normalized columns:", list(df.columns))

### data set currency is in IDR, needed to find IDR to USD conversion rate.
def normalize_price(series):
    s = pd.to_numeric(series, errors='coerce')
    med = s.median()
    if med > 1e6:
        fx = 15000
        return (s / fx).round(2), "IDR→USD (/15000)"
    elif med > 10000:
        return (s / 100).round(2), "cents→USD (/100)"
    else:
        return s.round(2), "looks like USD already"

df['price'] = pd.to_numeric(df['price'], errors='coerce')
df['price_usd'], rule = normalize_price(df['price'])
print("Applied rule:", rule)
print(df['price_usd'].describe())

### view all available rows.
df['description'] = df.apply(
    lambda row: f"{row['manufacturer']} {row['model_name']} ({row['category']}) "
                f"with {row['cpu']}, {row['ram']} RAM, {row['storage']} storage, "
                f"{row['gpu']} GPU, priced at ${row['price_usd']}",
    axis=1
)

### load the model/embedding 
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Encoding descriptions...")
embeddings = model.encode(df['description'].tolist(), show_progress_bar=True)


def search_laptops(query, k=3):
    q_embedding = model.encode([query])

    similarities = cosine_similarity(q_embedding, embeddings)[0]
    top_indices =  similarities.argsort()[-k:][::-1]

    result = []
    for i in top_indices:
        row = df.iloc[i]
        line = f"{row['manufacturer']} {row['model_name']} - ${row['price_usd']}"
        result.append(line)
    return  "\n".join(result)

### artifacts saved.
np.save("data/laptop_embeddings.npy", embeddings)
df.to_pickle("data/laptops.pkl")

print("Embeddings + data saved.")
