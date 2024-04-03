from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

uri = os.environ.get("MONGO_URI")
db = MongoClient(uri)["codetool"]

collection_users = db["users"]
collection_chats = db["chats"]