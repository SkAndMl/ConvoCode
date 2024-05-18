from fastapi import APIRouter, Body, HTTPException
from utils.code import complete_code
from starlette import status
from utils.database import collection_codes, collection_users
from bson import ObjectId


router = APIRouter()


@router.post(path="/completeCode")
async def complete_code_route(user_id: str = Body(...),
                              incomplete_code: str=Body(...)):
    print(user_id, incomplete_code)
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
    
    incomplete_code = incomplete_code.split("\n")[-1]
    print(incomplete_code, "incomplete")
    completed_code = complete_code(incomplete_code)
    


    return {"completed_code": completed_code}

