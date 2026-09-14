import numpy as np
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "ai_ml"))
from matching import find_match_for_item
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

def calculate_ai_similarity(item_a: Item, item_b: Item) -> float:
    """
    Member C ke AI model (ai_ml/matching.py) se text-similarity confidence (0.0-1.0) nikalta hai.
    """
    try:
        result = find_match_for_item(item_a, [item_b], threshold=0.0)
        return result.get("confidence", 0.0)
    except Exception as e:
        print(f"[AI MATCH ERROR] {e}")
        return 0.0

def calculate_heuristic_match(item_a: Item, item_b: Item) -> float:
    """
    Fallback matching calculation incorporating text, location, and time proximity.
    Member C's AI model embeds onto this pipeline.
    """
    score = 0.0

    # 1. Category Match
    if item_a.category.lower() == item_b.category.lower():
        score += 30.0

    # 2. Color Match
    if item_a.color.lower() == item_b.color.lower():
        score += 15.0

    # 3. Location Matching
    if item_a.location.lower() in item_b.location.lower() or item_b.location.lower() in item_a.location.lower():
        score += 15.0

    # 4. Time Proximity Boost
    time_diff_days = abs((item_a.timestamp - item_b.timestamp).days)
    if time_diff_days <= 1:
        score += 15.0
    elif time_diff_days <= 7:
        score += 7.5

    # 5. AI Description Similarity (Member C's model)
    ai_confidence = calculate_ai_similarity(item_a, item_b)
    score += ai_confidence * 25.0

    return min(score, 100.0)