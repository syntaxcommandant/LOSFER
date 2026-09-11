from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def find_match(lost_description, found_descriptions):
    """
    Text similarity nikalta hai lost item aur found items ke beech
    """
    documents = [lost_description] + found_descriptions
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
    return similarity_scores[0]


def get_best_match(lost_description, found_descriptions, threshold=0.3):
    """
    Best match dhoondta hai aur batata hai match mila ya nahi
    """
    scores = find_match(lost_description, found_descriptions)
    best_index = scores.argmax()
    best_score = scores[best_index]

    if best_score >= threshold:
        return {
            "match_found": True,
            "matched_item": found_descriptions[best_index],
            "confidence": round(float(best_score), 2)
        }
    else:
        return {
            "match_found": False,
            "matched_item": None,
            "confidence": round(float(best_score), 2)
        }


def get_best_match_with_category(lost_item, found_items, threshold=0.3):
    """
    lost_item: dict - {"description": "...", "category": "..."}
    found_items: list of dicts - [{"description": "...", "category": "..."}, ...]

    Pehle same category ke items filter karta hai, fir unhi ke andar match dhoondta hai
    """
    same_category_items = [
        item for item in found_items
        if item["category"].lower() == lost_item["category"].lower()
    ]

    if not same_category_items:
        return {
            "match_found": False,
            "matched_item": None,
            "confidence": 0.0,
            "reason": "No items found in this category"
        }

    descriptions = [item["description"] for item in same_category_items]
    result = get_best_match(lost_item["description"], descriptions, threshold)

    return result


# Test karne ke liye (dummy data)
if __name__ == "__main__":
    lost_item = {
        "description": "silver wrist watch with leather strap",
        "category": "accessories"
    }

    found_items = [
        {"description": "silver ring with small stone", "category": "jewelry"},
        {"description": "blue backpack found near library", "category": "bags"},
        {"description": "silver watch with brown leather strap", "category": "accessories"},
        {"description": "black umbrella left in classroom", "category": "others"}
    ]

    print("--- Category-Based Match Result ---")
    result = get_best_match_with_category(lost_item, found_items)
    print(result)
        



