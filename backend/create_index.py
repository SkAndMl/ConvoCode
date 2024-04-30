from langchain.document_loaders.directory import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain.embeddings.huggingface import HuggingFaceBgeEmbeddings
from langchain.schema import Document

import os
from typing import List, Union


# ------- CONSTANTS ------
DIR_PATH = "./data/{library_name}"
EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 200
INDEX_PATH = "./vectorstores/{library_name}"
# -----------------------


def create_chunks(library_name: str) -> List[Document]:

    loader = DirectoryLoader(path=DIR_PATH.format(library_name=library_name))
    text_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n"],
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len
    )
    
    docs: List[Document] = loader.load()
    chunks: List[Document] = text_splitter.split_documents(documents=docs)

    return chunks
    
def create_index(library_name: str) -> Union[bool, Exception]:

    if not os.path.exists("./vectorstores"):
        os.mkdir("./vectorstores")
    
    if os.path.exists(INDEX_PATH.format(library_name=library_name)):
        return True
    
    try:
        chunks: List[Document] = create_chunks(library_name=library_name)

        embedding = HuggingFaceBgeEmbeddings(
            model_name=EMBEDDING_MODEL,
            encode_kwargs={
                "normalize_embeddings" : True
            }
        )

        index = FAISS.from_documents(documents=chunks, embedding=embedding)
        index.save_local(folder_path=INDEX_PATH.format(library_name=library_name))
        return True
    except Exception as e:
        return e


if __name__ == "__main__":
    for dir in os.listdir("./data"):
        path = os.path.join("./data", dir)
        if os.path.isdir(path):
            result = create_index(library_name=dir)
            if isinstance(result, bool):
                print(f"Index successfully created at {INDEX_PATH.format(library_name=dir)}")
            else:
                print(f"Index not created due to {result}")