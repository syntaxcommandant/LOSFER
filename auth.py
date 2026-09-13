import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth
from dashboard import router as dashboard_router

# Firebase credentials load karna — pehle environment variable check karo (Railway ke liye),
# agar nahi mila to local JSON file use karo (apne computer ke liye)
firebase_creds_json = os.environ.get("FIREBASE_CREDENTIALS")

if firebase_creds_json:
    cred_dict = json.loads(firebase_creds_json)
    cred = credentials.Certificate(cred_dict)
else:
    cred = credentials.Certificate("losfer-e7f20-firebase-adminsdk-fbsvc-28b735365d.json")

firebase_admin.initialize_app(cred)

app = FastAPI()

app.include_router(dashboard_router)

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