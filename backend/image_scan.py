from nudenet import NudeDetector

detector = NudeDetector()

def check_image(image_path):
    """
    image_path: uploaded image ka file path
    Return: True agar image safe hai, False agar inappropriate content mila
    """
    result = detector.detect(image_path)

    unsafe_labels = [
        "FEMALE_BREAST_EXPOSED",
        "FEMALE_GENITALIA_EXPOSED",
        "MALE_GENITALIA_EXPOSED",
        "BUTTOCKS_EXPOSED"
    ]

    for detection in result:
        if detection["class"] in unsafe_labels and detection["score"] > 0.5:
            return {"safe": False, "reason": detection["class"]}

    return {"safe": True, "reason": None}


# Test karne ke liye
if __name__ == "__main__":
    test_image = "test.jpg"   # apni koi test image ka naam daalo
    result = check_image(test_image)
    print(result)