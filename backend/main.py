from fastapi import UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
import json
from image_scan import check_image
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Optional

from config import settings
from database import engine, get_db
from models import Base
import models, schemas, services


# Initialize database schema migrations
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LoseFer Backend Engine - Member B", version="1.0.0")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dummy User Dependency for multi-user context testing
# (Replaced by JWT middleware in Auth integration)
def get_current_user_id() -> int:
    return 1


# --- MY REPORTS ENDPOINT ---

@app.get("/my-reports", response_model=List[schemas.ItemResponse])
def get_my_reports(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return (
        db.query(models.Item)
        .filter(models.Item.user_id == user_id)
        .order_by(models.Item.timestamp.desc())
        .all()
    )


# --- REPORTING ENDPOINTS ---

@app.post("/report-lost", response_model=schemas.ItemResponse, status_code=status.HTTP_201_CREATED)
def report_lost(
    item_in: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    item_data = schemas.ItemCreate(**json.loads(item_in))
    image_path = None

    if image:
        image_path = f"uploads/{image.filename}"

        with open(image_path, "wb") as f:
            f.write(image.file.read())

        is_safe = check_image(image_path)

        if not is_safe:
            raise HTTPException(
                status_code=400,
                detail="Image flagged as inappropriate content"
            )

    item = models.Item(
        **item_data.model_dump(
            exclude_unset=True,
            exclude={"timestamp", "image_url"}
        ),
        item_type=models.ItemTypeEnum.LOST,
        user_id=user_id,
        timestamp=item_data.timestamp or datetime.now(timezone.utc),
        image_url=image_path
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@app.post("/report-found", response_model=schemas.ItemResponse, status_code=status.HTTP_201_CREATED)
def report_found(
    item_in: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Submits a found item report.
    """

    item_data = schemas.ItemCreate(**json.loads(item_in))

    image_path = f"uploads/{image.filename}"

    with open(image_path, "wb") as f:
        f.write(image.file.read())

    is_safe = check_image(image_path)

    if not is_safe:
        raise HTTPException(
            status_code=400,
            detail="Image flagged as inappropriate content"
        )

    item = models.Item(
        **item_data.model_dump(
            exclude_unset=True,
            exclude={"timestamp", "image_url"}
        ),
        item_type=models.ItemTypeEnum.FOUND,
        user_id=user_id,
        timestamp=item_data.timestamp or datetime.now(timezone.utc),
        image_url=image_path
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


# --- OWNERSHIP VERIFICATION ENDPOINT ---

@app.post("/verify-item/{item_id}")
def verify_item(
    item_id: int,
    submitted_answer: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Verifies claimant's secret answer against the stored one using keyword matching.
    """

    item = db.query(models.Item).filter(
        models.Item.id == item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    stored_answer = item.secret_answer.strip().lower()
    given_answer = submitted_answer.strip().lower()

    ignore_words = {
        "the",
        "a",
        "an",
        "is",
        "are",
        "there",
        "it",
        "has",
        "on",
        "of",
        "in"
    }

    stored_words = set(stored_answer.split()) - ignore_words
    given_words = set(given_answer.split()) - ignore_words

    if not stored_words:
        return {
            "verified": False,
            "message": "No valid secret answer stored"
        }

    match_count = len(stored_words & given_words)
    match_ratio = match_count / len(stored_words)

    if match_ratio >= 0.6:
        return {
            "verified": True,
            "message": "Verification successful",
            "match_score": round(match_ratio * 100, 1)
        }

    else:
        return {
            "verified": False,
            "message": "Answer does not sufficiently match. Manual verification required.",
            "match_score": round(match_ratio * 100, 1)
        }


# --- FOUND ITEMS ENDPOINT ---

@app.get("/items", response_model=List[schemas.ItemResponse])
def get_found_items(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Retrieves and lists all found items, with optional category filtering.
    """

    query = db.query(models.Item).filter(
        models.Item.item_type == models.ItemTypeEnum.FOUND
    )

    if category:
        query = query.filter(
            models.Item.category.ilike(f"%{category}%")
        )

    return query.all()


# --- AI MATCHING ENDPOINT ---

@app.get("/match/{item_id}", response_model=List[schemas.MatchResultResponse])
def get_matches_for_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    """
    Calculates and returns ranked candidate matches using Member C's scoring factors.
    Stores high-confidence match entities in database and triggers notifications.
    """

    target_item = db.query(models.Item).filter(
        models.Item.id == item_id
    ).first()

    if not target_item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    opposite_type = (
        models.ItemTypeEnum.FOUND
        if target_item.item_type == models.ItemTypeEnum.LOST
        else models.ItemTypeEnum.LOST
    )

    candidates = db.query(models.Item).filter(
        models.Item.item_type == opposite_type
    ).all()

    ranked_results = []

    for candidate in candidates:

        score = services.calculate_heuristic_match(
            target_item,
            candidate
        )

        is_high_confidence = score >= settings.MATCH_SCORE_THRESHOLD

        match_entry = db.query(models.Match).filter(
            models.Match.lost_item_id == (
                target_item.id
                if target_item.item_type == models.ItemTypeEnum.LOST
                else candidate.id
            ),
            models.Match.found_item_id == (
                candidate.id
                if target_item.item_type == models.ItemTypeEnum.LOST
                else target_item.id
            )
        ).first()

        if not match_entry:

            match_entry = models.Match(
                lost_item_id=(
                    target_item.id
                    if target_item.item_type == models.ItemTypeEnum.LOST
                    else candidate.id
                ),
                found_item_id=(
                    candidate.id
                    if target_item.item_type == models.ItemTypeEnum.LOST
                    else target_item.id
                ),
                similarity_score=score
            )

            db.add(match_entry)
            db.commit()
            db.refresh(match_entry)

        if is_high_confidence and not match_entry.is_notification_sent:

            notified = services.trigger_match_notification(
                lost_item=(
                    target_item
                    if target_item.item_type == models.ItemTypeEnum.LOST
                    else candidate
                ),
                found_item=(
                    candidate
                    if target_item.item_type == models.ItemTypeEnum.LOST
                    else target_item
                ),
                score=score
            )

            if notified:
                match_entry.is_notification_sent = True
                db.commit()

        ranked_results.append({
            "match_id": match_entry.id,
            "candidate_item": candidate,
            "similarity_score": score,
            "high_confidence_match": is_high_confidence
        })

    ranked_results.sort(
        key=lambda x: x["similarity_score"],
        reverse=True
    )

    return ranked_results


# --- CLAIM ENDPOINTS ---

@app.post(
    "/claim",
    response_model=schemas.ClaimResponse,
    status_code=status.HTTP_201_CREATED
)
def submit_claim(
    claim_in: schemas.ClaimCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Submits a claim and stores verification answers for security verification.
    """

    item = db.query(models.Item).filter(
        models.Item.id == claim_in.item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Target item not found"
        )

    if not claim_in.verification_answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Verification answer cannot be empty"
        )

    claim = models.Claim(
        item_id=claim_in.item_id,
        claimant_id=user_id,
        verification_answer=claim_in.verification_answer,
        status=models.ClaimStatusEnum.PENDING
    )

    db.add(claim)
    db.commit()
    db.refresh(claim)

    return claim


# ==========================================================
# --- STAFF DASHBOARD ENDPOINTS ---
# ==========================================================

@app.get(
    "/staff/claims",
    response_model=List[schemas.ClaimResponse]
)
def get_pending_claims(
    db: Session = Depends(get_db)
):
    """
    Retrieves all claims that are currently pending staff review.
    """

    claims = (
        db.query(models.Claim)
        .filter(
            models.Claim.status == models.ClaimStatusEnum.PENDING
        )
        .order_by(models.Claim.id.desc())
        .all()
    )

    return claims


@app.patch(
    "/staff/claims/{claim_id}/approve",
    response_model=schemas.ClaimResponse
)
def approve_claim(
    claim_id: int,
    db: Session = Depends(get_db)
):
    """
    Approves a pending claim.
    """

    claim = db.query(models.Claim).filter(
        models.Claim.id == claim_id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    claim.status = models.ClaimStatusEnum.APPROVED

    db.commit()
    db.refresh(claim)

    return claim


@app.patch(
    "/staff/claims/{claim_id}/reject",
    response_model=schemas.ClaimResponse
)
def reject_claim(
    claim_id: int,
    db: Session = Depends(get_db)
):
    """
    Rejects a pending claim.
    """

    claim = db.query(models.Claim).filter(
        models.Claim.id == claim_id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    claim.status = models.ClaimStatusEnum.REJECTED

    db.commit()
    db.refresh(claim)

    return claim