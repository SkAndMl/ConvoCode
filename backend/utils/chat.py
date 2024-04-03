import together
import os
from langchain.vectorstores.faiss import FAISS
from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from dotenv import load_dotenv, find_dotenv
from .constants import EMBEDDING_MODEL, INDEX_PATH, LLM, K, TEMPERATURE
from .constants import MAX_TOKENS, PROMPT

from langchain.schema import Document
from typing import List

load_dotenv(find_dotenv())
together.api_key = os.environ.get("TOGETHER_API_KEY_SK")


INDEX_PATH = "vector_stores/{library_name}"

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


def get_answer(query: str, library_name: str) -> str:
    
    index = FAISS.load_local(folder_path=INDEX_PATH.format(library_name=library_name),
                             embeddings=embedding)

    chunks: List[Document] = index.similarity_search(
        query=query,
        k=K
    )
    
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