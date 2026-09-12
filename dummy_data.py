from fastapi import FastAPI

app = FastAPI()

# ---------------- FOUND ITEMS (15-20 dummy entries) ----------------
found_items = [
    {"id": 1, "item_name": "Blue Water Bottle", "category": "Bottle", "location": "Library, 2nd Floor", "date_found": "2026-09-05", "description": "A blue steel water bottle with a dented cap, found near the reading section.", "finder_email": "aman.k@example.com"},
    {"id": 2, "item_name": "Black Backpack", "category": "Bag", "location": "Canteen", "date_found": "2026-09-06", "description": "Black backpack with a laptop sleeve, one broken zipper on the front pocket.", "finder_email": "priya.s@example.com"},
    {"id": 3, "item_name": "Scientific Calculator", "category": "Electronics", "location": "Room 204, Block B", "date_found": "2026-09-06", "description": "Casio fx-991 calculator, slightly scratched back cover, no case.", "finder_email": "rohit.v@example.com"},
    {"id": 4, "item_name": "Silver Wristwatch", "category": "Accessory", "location": "Sports Ground", "date_found": "2026-09-07", "description": "Analog silver wristwatch, leather strap slightly torn.", "finder_email": "neha.d@example.com"},
    {"id": 5, "item_name": "Spectacles (Black Frame)", "category": "Eyewear", "location": "Auditorium", "date_found": "2026-09-07", "description": "Black rectangular frame spectacles in a maroon hard case.", "finder_email": "arjun.m@example.com"},
    {"id": 6, "item_name": "USB Pen Drive (16GB)", "category": "Electronics", "location": "Computer Lab 3", "date_found": "2026-09-08", "description": "SanDisk 16GB pen drive, red color, keychain attached.", "finder_email": "simran.k@example.com"},
    {"id": 7, "item_name": "Grey Hoodie", "category": "Clothing", "location": "Basketball Court", "date_found": "2026-09-08", "description": "Grey hoodie, size M, small paint stain on the left sleeve.", "finder_email": "kabir.s@example.com"},
    {"id": 8, "item_name": "Umbrella (Black)", "category": "Accessory", "location": "Main Gate", "date_found": "2026-09-09", "description": "Black folding umbrella, one rib slightly bent.", "finder_email": "ishita.r@example.com"},
    {"id": 9, "item_name": "ID Card Holder", "category": "Accessory", "location": "Cafeteria", "date_found": "2026-09-09", "description": "Transparent ID card holder with a blue lanyard, no card inside.", "finder_email": "yash.t@example.com"},
    {"id": 10, "item_name": "Wireless Earbuds Case", "category": "Electronics", "location": "Library, Ground Floor", "date_found": "2026-09-10", "description": "White earbuds charging case, minor scratches, no earbuds inside.", "finder_email": "meera.j@example.com"},
    {"id": 11, "item_name": "Notebook (Physics)", "category": "Stationery", "location": "Room 108, Block A", "date_found": "2026-09-10", "description": "Blue ruled notebook labeled 'Physics Notes', half-filled.", "finder_email": "devansh.p@example.com"},
    {"id": 12, "item_name": "Water Bottle (Pink)", "category": "Bottle", "location": "Girls Hostel Common Room", "date_found": "2026-09-11", "description": "Pink plastic bottle with a floral sticker on it.", "finder_email": "ananya.g@example.com"},
    {"id": 13, "item_name": "Charger (Type-C)", "category": "Electronics", "location": "Seminar Hall", "date_found": "2026-09-11", "description": "White Type-C charger, cable slightly frayed near the plug.", "finder_email": "vivek.n@example.com"},
    {"id": 14, "item_name": "Sunglasses", "category": "Eyewear", "location": "Parking Area", "date_found": "2026-09-11", "description": "Black aviator sunglasses, one scratch on the right lens.", "finder_email": "tanvi.b@example.com"},
    {"id": 15, "item_name": "Keychain (Car Keys)", "category": "Keys", "location": "Admin Block Entrance", "date_found": "2026-09-12", "description": "Set of car keys with a small red keychain, no other identification.", "finder_email": "harshuted@gamil.com"},
    {"id": 16, "item_name": "Laptop Sleeve (Grey)", "category": "Bag", "location": "Computer Lab 1", "date_found": "2026-09-12", "description": "Grey neoprene laptop sleeve, fits 14-inch laptops, small tear on the corner.", "finder_email": "ritika.s@example.com"},
    {"id": 17, "item_name": "Wallet (Brown)", "category": "Accessory", "location": "Boys Hostel Mess", "date_found": "2026-09-12", "description": "Brown leather wallet, empty, slight wear on the edges.", "finder_email": "aditya.r@example.com"},
    {"id": 18, "item_name": "Water Bottle (Steel, Green)", "category": "Bottle", "location": "Chemistry Lab", "date_found": "2026-09-12", "description": "Green steel bottle with a college sticker on the side.", "finder_email": "sneha.k@example.com"},
]

# ---------------- LOST ITEMS (5-6 dummy descriptions) ----------------
lost_items = [
    {"id": 1, "item_name": "Blue Water Bottle", "category": "Bottle", "last_seen_location": "Library, 2nd Floor", "date_lost": "2026-09-05", "description": "Lost my blue steel water bottle, it has a small dent on the cap.", "owner_email": "student1@example.com"},
    {"id": 2, "item_name": "Black Backpack", "category": "Bag", "last_seen_location": "Canteen", "date_lost": "2026-09-06", "description": "My black backpack with a laptop sleeve is missing, front pocket zipper is broken.", "owner_email": "student2@example.com"},
    {"id": 3, "item_name": "Scientific Calculator", "category": "Electronics", "last_seen_location": "Room 204, Block B", "date_lost": "2026-09-06", "description": "Lost my Casio fx-991 calculator during class, back cover is scratched.", "owner_email": "student3@example.com"},
    {"id": 4, "item_name": "Silver Wristwatch", "category": "Accessory", "last_seen_location": "Sports Ground", "date_lost": "2026-09-07", "description": "My silver analog watch fell off during practice, strap is slightly torn.", "owner_email": "student4@example.com"},
    {"id": 5, "item_name": "USB Pen Drive (16GB)", "category": "Electronics", "last_seen_location": "Computer Lab 3", "date_lost": "2026-09-08", "description": "Lost a red SanDisk 16GB pen drive with a keychain attached.", "owner_email": "student5@example.com"},
    {"id": 6, "item_name": "ID Card Holder", "category": "Accessory", "last_seen_location": "Cafeteria", "date_lost": "2026-09-09", "description": "Missing my transparent ID card holder with a blue lanyard.", "owner_email": "student6@example.com"},
]

# ---------------- ENDPOINTS TO VIEW THE DATA ----------------
@app.get("/dummy/found-items")
def get_found_items():
    return {"count": len(found_items), "found_items": found_items}

@app.get("/dummy/lost-items")
def get_lost_items():
    return {"count": len(lost_items), "lost_items": lost_items}