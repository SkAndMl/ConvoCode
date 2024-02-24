import together
import os
from langchain.vectorstores.faiss import FAISS
from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from dotenv import load_dotenv, find_dotenv

from langchain.schema import Document
from typing import List

load_dotenv(find_dotenv())
together.api_key = os.environ.get("TOGETHER_API_KEY_SK")

# ------- CONSTANTS ------
EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"
INDEX_PATH = "vector_stores/index"
LLM="mistralai/Mistral-7B-Instruct-v0.2"
K = 3
TEMPERATURE=0.1
MAX_TOKENS=512
SYSTEM_PROMPT="""
You are an expert code assistant that specializes in python data science libraries.
Your job is to answer the user query based on the context provided. 
The users query will be around the python data science libraries and the user always prefers an answer with code example.
Keep your answers short and precise.
Start your response with 'Answer: '.
Query: {query}
Context: {context}
"""
PROMPT = f"<s>[INST]{SYSTEM_PROMPT}[/INST]"
# -----------------------

# ------- OBJECTS --------
embedding = HuggingFaceBgeEmbeddings(
    model_name=EMBEDDING_MODEL,
    encode_kwargs={
        "normalize_embeddings" : True
    }
)
index = FAISS.load_local(
    folder_path=INDEX_PATH,
    embeddings=embedding
)

retriever = index.as_retriever(search_kwargs={"k" : K})
# -----------------------


def get_answer(query: str) -> str:
    
    chunks: List[Document] = retriever.get_relevant_documents(query=query)
    
    context = ""
    for i, chunk in enumerate(chunks):
        context += f"Context {i+1} is " + chunk.page_content
    
    prompt = PROMPT.format(query=query, context=context)

    output = together.Complete.create(
        prompt=prompt,
        model=LLM,
        max_tokens=MAX_TOKENS,
        temperature=TEMPERATURE,
        stop=["</s>"]
    )

    return output["output"]["choices"][0]["text"]


if __name__ == "__main__":

    while True:

        query = input("Enter your query: ")
        if query=='q':
            print("Exitting chat...")
            break
        answer = get_answer(query=query)
        print(f"Answer is {answer}")