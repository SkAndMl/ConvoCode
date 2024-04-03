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