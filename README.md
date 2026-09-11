# LOSFER

A Secure, AI-Assisted Campus Lost & Found Platform with Privacy-Preserving Verification

## AI/ML Module

## Overview
This module handles two core AI features for the LOSFER platform: matching lost items with found items using text similarity, and scanning uploaded images for inappropriate content before publishing.

## Features

**1. Text Matching (`matching.py`)**
- Uses **TF-IDF (Term Frequency-Inverse Document Frequency)** to convert item descriptions into numerical vectors
- Uses **Cosine Similarity** to calculate how similar a lost item's description is to found items' descriptions
- **Threshold-based decision**: automatically determines whether a match exists (default threshold = 0.3)
- **Category-based filtering**: only compares items within the same category (e.g., Electronics, Accessories, Bags) to reduce false positive matches caused by common/overlapping words

**2. Image Scanning (`image_scan.py`)**
- Uses **NudeNet** (an open-source AI model) to detect inappropriate content in uploaded images
- Runs before an image is published on the platform, ensuring content safety
- Returns a simple safe/unsafe result with a confidence score

## Folder Structure

ai_ml/
├── matching.py # Text similarity + category-based matching logic
├── image_scan.py # Image content safety check

## How to Run

1. Activate the virtual environment:
```bash
.\venv\Scripts\Activate.ps1

2. Install dependencies:
pip install -r requirements.txt

3. Run the matching script:
python ai_ml/matching.py

4.Run the image scanning script:
python ai_ml/image_scan.py

## Sample Output -->
# Matching:
{'match_found': True, 'matched_item': 'silver watch with brown leather strap', 'confidence': 0.72}
#Image Scan:
{'safe': True, 'reason': None}

##Tech Stack
Python
scikit-learn (TF-IDF, Cosine Similarity)
NudeNet (image content detection)

##Notes:
The matching threshold (0.3) is currently a default value and may need tuning based on real-world data.
This module currently performs text-based matching only; image-based similarity matching is a potential future enhancement.

