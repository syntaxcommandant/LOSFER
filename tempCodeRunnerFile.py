
# POST endpoint - claim reject karne ke liye
@app.post("/claims/{claim_id}/reject")
def reject_claim(claim_id: int):
    for claim in claims_db:
        if claim["id"] == claim_id:
            claim["status"] = "rejected"
            return {"message": "Claim rejected", "claim": claim}
    raise HTTPException(status_code=404, detail="Claim not found")