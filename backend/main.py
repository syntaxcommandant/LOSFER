from fastapi import UploadFile, File, Form
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy User Dependency for multi-user context testing (Replaced by JWT middleware in Auth integration)
def get_current_user_id() -> int:
    return 1

# --- REPORTING ENDPOINTS ---[cite: 1]

@app.post("/report-lost", response_model=schemas.ItemResponse, status_code=status.HTTP_201_CREATED)
def report_lost(
    item_in: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    item_data = schemas.ItemCreate(**json.loads(item_in))
    # image save karo
    image_path = f"uploads/{image.filename}"
    with open(image_path, "wb") as f:
        f.write(image.file.read())

    # scan karo
    is_safe = check_image(image_path)
    if not is_safe:
        raise HTTPException(status_code=400, detail="Image flagged as inappropriate content")

    item = models.Item(
        **item_data.model_dump(exclude_unset=True, exclude={"timestamp", "image_url"}),
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

     # image save karo
    image_path = f"uploads/{image.filename}"
    with open(image_path, "wb") as f:
        f.write(image.file.read())

    # scan karo
    is_safe = check_image(image_path)
    if not is_safe:
        raise HTTPException(status_code=400, detail="Image flagged as inappropriate content")
    
    item = models.Item(
    **item_data.model_dump(exclude_unset=True, exclude={"timestamp", "image_url"}),
    item_type=models.ItemTypeEnum.FOUND,
    user_id=user_id,
    timestamp=item_data.timestamp or datetime.now(timezone.utc),
    image_url=image_path
)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@app.get("/items", response_model=List[schemas.ItemResponse])
def get_found_items(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Retrieves and lists all found items, with optional category filtering[cite: 1].
    """
    query = db.query(models.Item).filter(models.Item.item_type == models.ItemTypeEnum.FOUND)
    if category:
        query = query.filter(models.Item.category.ilike(f"%{category}%"))
    return query.all()

# --- AI MATCHING ENDPOINT ---[cite: 1]

@app.get("/match/{item_id}", response_model=List[schemas.MatchResultResponse])
def get_matches_for_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    """
    Calculates and returns ranked candidate matches using Member C's scoring factors[cite: 1].
    Stores high-confidence match entities in database and triggers notifications[cite: 1].
    """
    target_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not target_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Determine opposite item pool
    opposite_type = models.ItemTypeEnum.FOUND if target_item.item_type == models.ItemTypeEnum.LOST else models.ItemTypeEnum.LOST
    candidates = db.query(models.Item).filter(models.Item.item_type == opposite_type).all()

    ranked_results = []
    for candidate in candidates:
        score = services.calculate_heuristic_match(target_item, candidate)
        is_high_confidence = score >= settings.MATCH_SCORE_THRESHOLD

        # Record or update match record
        match_entry = db.query(models.Match).filter(
            models.Match.lost_item_id == (target_item.id if target_item.item_type == models.ItemTypeEnum.LOST else candidate.id),
            models.Match.found_item_id == (candidate.id if target_item.item_type == models.ItemTypeEnum.LOST else target_item.id)
        ).first()

        if not match_entry:
            match_entry = models.Match(
                lost_item_id=target_item.id if target_item.item_type == models.ItemTypeEnum.LOST else candidate.id,
                found_item_id=candidate.id if target_item.item_type == models.ItemTypeEnum.LOST else target_item.id,
                similarity_score=score
            )
            db.add(match_entry)
            db.commit()
            db.refresh(match_entry)

        # Trigger notification if criteria met[cite: 1]
        if is_high_confidence and not match_entry.is_notification_sent:
            notified = services.trigger_match_notification(
                lost_item=target_item if target_item.item_type == models.ItemTypeEnum.LOST else candidate,
                found_item=candidate if target_item.item_type == models.ItemTypeEnum.LOST else target_item,
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

    # Sort results highest score first
    ranked_results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return ranked_results

# --- CLAIM ENDPOINTS ---[cite: 1]

@app.post("/claim", response_model=schemas.ClaimResponse, status_code=status.HTTP_201_CREATED)
def submit_claim(
    claim_in: schemas.ClaimCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Submits a claim and stores verification answers for security verification[cite: 1].
    """
    item = db.query(models.Item).filter(models.Item.id == claim_in.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Target item not found")

    if not claim_in.verification_answer.strip():
        raise HTTPException(status_code=400, detail="Verification answer cannot be empty")

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