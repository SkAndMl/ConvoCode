import together
import os
from langchain.vectorstores.faiss import FAISS
from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from dotenv import load_dotenv, find_dotenv
from .constants import EMBEDDING_MODEL, INDEX_PATH, LLM, K, TEMPERATURE
from .constants import MAX_TOKENS, PROMPT
import google.generativeai as genai

from langchain.schema import Document
from typing import List

load_dotenv(find_dotenv())
together.api_key = os.environ.get("TOGETHER_API_KEY_SK")


INDEX_PATH = "vectorstores/{library_name}"

# ------- OBJECTS --------
embedding = HuggingFaceBgeEmbeddings(
    model_name=EMBEDDING_MODEL,
    encode_kwargs={
        "normalize_embeddings" : True
    }
)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")
config = genai.GenerationConfig(temperature=TEMPERATURE,
                                max_output_tokens=MAX_TOKENS)
# -----------------------


# def get_answer(query: str, library_name: str) -> str:
    
#     index = FAISS.load_local(folder_path=INDEX_PATH.format(library_name=library_name),
#                              embeddings=embedding)

#     chunks: List[Document] = index.similarity_search(
#         query=query,
#         k=K
#     )
    
#     context = ""
#     for i, chunk in enumerate(chunks):
#         context += f"Context {i+1} is " + chunk.page_content
    
#     prompt = PROMPT.format(query=query, context=context)

#     output = together.Complete.create(
#         prompt=prompt,
#         model=LLM,
#         max_tokens=MAX_TOKENS,
#         temperature=TEMPERATURE,
#         stop=["</s>"]
#     )

#     return output["output"]["choices"][0]["text"]


def get_answer(query: str, library_name: str) -> str:

    index = FAISS.load_local(folder_path=INDEX_PATH.format(library_name=library_name),
                             embeddings=embedding)
    chunks: List[Document] = index.similarity_search(
        query=query,
        k=K
    )
    context = "".join([f"Context {i+1} is " + chunk.page_content for i,chunk in enumerate(chunks)])

    model_input_prompt = PROMPT.format(**{"query": query, "context": context})

    chat = model.start_chat(history=[])
    response = chat.send_message(model_input_prompt, generation_config=config)
    updated_history = chat.history
    return response.text