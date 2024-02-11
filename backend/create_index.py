from langchain.document_loaders.directory import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from langchain.schema import Document

import os
from typing import List, Union


# ------- CONSTANTS ------
DIR_PATH = "../data/numpy"
EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 200
INDEX_PATH = "./vector_stores/index"
# -----------------------


def create_chunks() -> List[Document]:

    loader = DirectoryLoader(path=DIR_PATH)
    text_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n"],
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len
    )
    
    docs: List[Document] = loader.load()
    chunks: List[Document] = text_splitter.split_documents(documents=docs)

    return chunks
    
def create_index() -> Union[bool, Exception]:

    if not os.path.exists("./vectorstores"):
        os.mkdir("./vectorstores")
    
    try:
        chunks: List[Document] = create_chunks()

        embedding = HuggingFaceBgeEmbeddings(
            model_name=EMBEDDING_MODEL,
            encode_kwargs={
                "normalize_embeddings" : True
            }
        )

        index = FAISS.from_documents(documents=chunks, embedding=embedding)
        index.save_local(folder_path=INDEX_PATH)
        return True
    except Exception as e:
        return e


if __name__ == "__main__":

    result = create_index()

    if isinstance(result, bool):
        print(f"Index successfully created at {INDEX_PATH}")
    else:
        print(f"Index not created due to {result}")