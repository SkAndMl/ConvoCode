from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

uri = "mongodb+srv://skandml:Sathya2406@cluster0.ynxtoer.mongodb.net/"
db = MongoClient(uri)["codetool"]

collection_users = db["users"]
collection_chats = db["chats"]