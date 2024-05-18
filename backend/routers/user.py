from fastapi import APIRouter, HTTPException, Body
from starlette import status
from utils.database import collection_users
import bcrypt


router = APIRouter()

@router.post("/signup")
async def create_user_route(username: str=Body(...),
                            email: str=Body(...),
                            password: str=Body(...)):


    user_doc = collection_users.find_one(filter={"email" : email})
    if user_doc is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="email already exists")
    
    user_id = collection_users.insert_one(document={
        "username": username,
        "email": email,
        "password": hash_password(password)
    }).inserted_id

    return {"user_id" : str(user_id)}


@router.post("/login")
async def login_route(email: str=Body(...),
                      password: str=Body(...)):
    
    user_doc = collection_users.find_one({"email": email})
    if user_doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
    
    if verify_password(user_doc["password"], password):
        return {"message" : "success", "user_id" : str(user_doc["_id"])}
    else:
        return {"message" : "login failed", "user_id" : "None"}


def hash_password(password):
    password = password.encode('utf-8')
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    return hashed

def verify_password(stored_password, provided_password):
    provided_password = provided_password.encode('utf-8')
    return bcrypt.checkpw(provided_password, stored_password)