from fastapi import APIRouter, Body, HTTPException
from starlette import status
from utils.chat import get_answer
from utils.database import collection_chats, collection_users
from datetime import datetime, UTC
from bson import ObjectId

router = APIRouter()


@router.post("/chat")
async def get_answer_route(user_id: str=Body(...),
                           chat_id: str=Body(None),
                           query: str=Body(...),
                           library_name: str=Body(None)):
    
    if chat_id is None and library_name is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Both chat id and library name is None")
    
    user_doc = collection_users.find_one(filter={"_id": ObjectId(user_id)})

    if user_doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")

    chat_doc = None
    if chat_id is None:
        chat_id = collection_chats.insert_one(
            {
                "user_id" : user_id,
                "library_name" : library_name,
                "chats" : []
            }
        ).inserted_id
    chat_doc = collection_chats.find_one(filter={"_id" : ObjectId(chat_id)})
    
    answer = get_answer(query=query, library_name=chat_doc["library_name"])
    
    _ = collection_chats.update_one(
        filter={
            "_id" : ObjectId(chat_doc["_id"])
        },
        update={
            "$push" : {
                "chat" : [
                    {
                        "role" : "user",
                        "text" : query,
                        "timestamp" : datetime.now(UTC)
                    },
                    {
                        "role" : "bot",
                        "text" : answer,
                        "timestamp" : datetime.now(UTC)   
                    }
                ]
            }
        }
    )

    return {"answer" : answer}