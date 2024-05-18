from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

uri = os.environ.get("MONGODB_URI")
db = MongoClient(uri)["codetool"]

collection_users = db["users"]
collection_chats = db["chats"]
collection_codes = db["codes"]
