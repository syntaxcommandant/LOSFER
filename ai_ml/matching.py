from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def find_match(lost_description, found_descriptions):
    """
    lost_description: string - jo lost item ka description hai
    found_descriptions: list of strings - saare found items ke descriptions
    """
    documents = [lost_description] + found_descriptions

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])

    return similarity_scores[0]

def get_best_match(lost_description, found_descriptions, threshold=0.3):
    
   # Best match dhoondta hai aur batata hai match mila ya nahi
    
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

# Test karne ke liye (dummy data)
if __name__ == "__main__":
    lost_item = "silver wrist watch with leather strap"

    found_items = [
        "blue backpack found near library",
        "silver watch with brown leather strap",
        "red water bottle in canteen",
        "black umbrella left in classroom"
    ]

    scores = find_match(lost_item, found_items)

    for i, score in enumerate(scores):
        print(f"Found item {i+1}: '{found_items[i]}' -> Similarity: {score:.2f}")

        print("\n--- Best Match Result ---")
    result = get_best_match(lost_item, found_items)
    print(result)

        



