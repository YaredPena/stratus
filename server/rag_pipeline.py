import os
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

def get_rag_pipeline():
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)
    api_key = os.getenv("OPENAI_API_KEY")

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=api_key)
    vectorstore = Chroma(persist_directory="data/chroma", embedding_function=embeddings)

    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
        You are a helpful laptop recommender.
        Context: {context}
        Question: {question}
        Answer clearly and concisely. If you don't know, say so.
        """
    )

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=api_key)

    qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=True
    )

    return qa