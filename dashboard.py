from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Temporary in-memory storage (baad mein database se replace hoga)
claims_db = [
    {"id": 1, "item_name": "Blue Water Bottle", "claimant_email": "student1@example.com", "status": "pending"},
    {"id": 2, "item_name": "Black Backpack", "claimant_email": "student2@example.com", "status": "pending"},
    {"id": 3, "item_name": "Calculator", "claimant_email": "student3@example.com", "status": "pending"},
]

# GET endpoint - saare pending claims dikhane ke liye
@app.get("/claims/pending")
def get_pending_claims():
    pending = [claim for claim in claims_db if claim["status"] == "pending"]
    return {"pending_claims": pending}

# POST endpoint - claim approve karne ke liye
@app.post("/claims/{claim_id}/approve")
def approve_claim(claim_id: int):
    for claim in claims_db:
        if claim["id"] == claim_id:
            claim["status"] = "approved"
            return {"message": "Claim approved", "claim": claim}
    raise HTTPException(status_code=404, detail="Claim not found")

# POST endpoint - claim reject karne ke liye
@app.post("/claims/{claim_id}/reject")
def reject_claim(claim_id: int):
    for claim in claims_db:
        if claim["id"] == claim_id:
            claim["status"] = "rejected"
            return {"message": "Claim rejected", "claim": claim}
    raise HTTPException(status_code=404, detail="Claim not found")