from fastapi import APIRouter, Body, HTTPException
from starlette import status
from utils.chat import get_answer

router = APIRouter()


@router.post("/getAnswer", status_code=status.HTTP_200_OK)
async def answer_route(query: str = Body(...)):

    if query == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="No query was passed")

    answer: str = get_answer(query=query)
    return answer