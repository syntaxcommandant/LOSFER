from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from models import ItemTypeEnum, ClaimStatusEnum

class ItemCreate(BaseModel):
    title: str
    description: str
    category: str
    color: str
    location: str
    timestamp: Optional[datetime] = None
    image_url: Optional[str] = None

class ItemResponse(BaseModel):
    id: int
    user_id: int
    item_type: ItemTypeEnum
    title: str
    description: str
    category: str
    color: str
    location: str
    timestamp: datetime
    image_url: Optional[str]

    class Config:
        from_attributes = True

class MatchResultResponse(BaseModel):
    match_id: Optional[int] = None
    candidate_item: ItemResponse
    similarity_score: float
    high_confidence_match: bool

class ClaimCreate(BaseModel):
    item_id: int
    verification_answer: str

class ClaimResponse(BaseModel):
    id: int
    item_id: int
    claimant_id: int
    verification_answer: str
    status: ClaimStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True