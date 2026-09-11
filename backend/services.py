import numpy as np
from datetime import datetime
from sqlalchemy.orm import Session
from config import settings
from models import Item, Match, ClaimStatusEnum

def trigger_match_notification(lost_item: Item, found_item: Item, score: float):
    """
    Simulates sending an in-app flag or email notification when a high-confidence match occurs.
    """
    if settings.ENABLE_MATCH_NOTIFICATIONS and score >= settings.MATCH_SCORE_THRESHOLD:
        print(f"[NOTIFICATION TRIGGER] High confidence match detected ({score}%) between Lost Item #{lost_item.id} and Found Item #{found_item.id}!")
        return True
    return False

def calculate_heuristic_match(item_a: Item, item_b: Item) -> float:
    """
    Fallback matching calculation incorporating text, location, and time proximity[cite: 1].
    Member C's AI model embeds onto this pipeline[cite: 1].
    """
    score = 0.0

    # 1. Category and Color Match
    if item_a.category.lower() == item_b.category.lower():
        score += 40.0
    if item_a.color.lower() == item_b.color.lower():
        score += 20.0

    # 2. Location Matching
    if item_a.location.lower() in item_b.location.lower() or item_b.location.lower() in item_a.location.lower():
        score += 20.0

    # 3. Time Proximity Boost
    time_diff_days = abs((item_a.timestamp - item_b.timestamp).days)
    if time_diff_days <= 1:
        score += 20.0
    elif time_diff_days <= 7:
        score += 10.0

    return min(score, 100.0)