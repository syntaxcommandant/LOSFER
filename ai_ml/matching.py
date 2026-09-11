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