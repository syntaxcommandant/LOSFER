import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Enum, Boolean, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class ItemTypeEnum(str, enum.Enum):
    LOST = "lost"
    FOUND = "found"

class ClaimStatusEnum(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("Item", back_populates="user")
    claims = relationship("Claim", back_populates="claimant")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_type = Column(Enum(ItemTypeEnum), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    secret_answer = Column(String, nullable=False)  # For verification during claims
    category = Column(String, index=True, nullable=False)
    color = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    image_url = Column(String, nullable=True)
    embedding = Column(JSON, nullable=True)  # Native JSON fallback or array vector for pgvector

    user = relationship("User", back_populates="items")
    matches = relationship("Match", foreign_keys="Match.lost_item_id", back_populates="lost_item")

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    claimant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    verification_answer = Column(Text, nullable=False)
    status = Column(Enum(ClaimStatusEnum), default=ClaimStatusEnum.PENDING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    claimant = relationship("User", back_populates="claims")
    item = relationship("Item")

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    found_item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    is_notification_sent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    lost_item = relationship("Item", foreign_keys=[lost_item_id])
    found_item = relationship("Item", foreign_keys=[found_item_id])