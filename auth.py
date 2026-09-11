from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth

# Connect to Firebase using our secret key
cred = credentials.Certificate("losfer-e7f20-firebase-adminsdk-fbsvc-28b735365d.json")
firebase_admin.initialize_app(cred)

app = FastAPI()

# Ye batata hai signup/login request mein kya-kya data aayega
class SignupRequest(BaseModel):
    email: str
    password: str

@app.post("/signup")
def signup(data: SignupRequest):
    try:
        user = auth.create_user(email=data.email, password=data.password)
        return {"message": "User created successfully", "uid": user.uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login")
def login(data: SignupRequest):
    try:
        user = auth.get_user_by_email(data.email)
        return {"message": "User found", "uid": user.uid, "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))