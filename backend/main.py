from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, user, code

app = FastAPI()

app.include_router(chat.router)
app.include_router(user.router)
app.include_router(code.router)

app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"]
)