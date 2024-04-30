from fastapi import APIRouter, Body, HTTPException
from utils.code import complete_code
from starlette import status


router = APIRouter()


@router.post(path="/complete_code")
async def complete_code_route(incomplete_code: str=Body(...)):

    if len(incomplete_code)==0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Empty string")
    completed_code = complete_code(incomplete_code)
    return {"completed_code": completed_code}