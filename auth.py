import firebase_admin
from firebase_admin import credentials, auth

# Connect to Firebase using our secret key
cred = credentials.Certificate("losfer-e7f20-firebase-adminsdk-fbsvc-28b735365d.json")
firebase_admin.initialize_app(cred)

print("Firebase connected successfully!")