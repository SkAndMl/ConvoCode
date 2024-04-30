from fastapi import APIRouter, Body, HTTPException
from utils.code import complete_code
from starlette import status
from utils.database import collection_codes, collection_users
from bson import ObjectId


router = APIRouter()


@router.post(path="/completeCode")
async def complete_code_route(user_id: str=Body(...),
                              session_id: str=Body(None),
                              incomplete_code: str=Body(...)):

    user_doc = collection_users.find_one(
        filter={
            "_id": ObjectId(user_id)
        }
    )

    if user_doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if len(incomplete_code)==0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Empty string")
    
    completed_code = complete_code(incomplete_code)

    if session_id is None:
        session_id = collection_codes.insert_one(
            document={
                "user_id": user_id,
                "completions": [
                    {
                        "incomplete_code": incomplete_code,
                        "completed_code": completed_code
                    }
                ]
            }
        ).inserted_id
    else:
        _ = collection_codes.update_one(
            filter={
                "_id": ObjectId(session_id)
            },
            update={
                "$push": {
                    "completions": {
                        "incomplete_code": incomplete_code,
                        "completed_code": completed_code
                    }
                }
            }
        )

    return {"completed_code": completed_code, "session_id": session_id}

