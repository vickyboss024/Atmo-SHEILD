"""
Location Service for Atmo SHEILD
Provides location search, alphabetical sorting, reverse geocoding, and nearby station discovery.
"""

import json
import math
import urllib.request
import urllib.parse
from database.database import get_connection

DEFAULT_LOCATIONS = [
    {"name": "Bhubaneswar", "area": "City Center", "city": "Bhubaneswar", "state": "Odisha", "country": "India", "latitude": 20.2961, "longitude": 85.8245},
    {"name": "Master Canteen", "area": "Station Square", "city": "Bhubaneswar", "state": "Odisha", "country": "India", "latitude": 20.2644, "longitude": 85.8394},
    {"name": "Janpath Road", "area": "Commercial Corridor", "city": "Bhubaneswar", "state": "Odisha", "country": "India", "latitude": 20.2818, "longitude": 85.8436},
    {"name": "Kalpana Square", "area": "South Junction", "city": "Bhubaneswar", "state": "Odisha", "country": "India", "latitude": 20.2520, "longitude": 85.8378},
    {"name": "Patia IT Corridor", "area": "North Hub", "city": "Bhubaneswar", "state": "Odisha", "country": "India", "latitude": 20.3588, "longitude": 85.8164},
    {"name": "Khandagiri Hills", "area": "Heritage Zone", "city": "Bhubaneswar", "state": "Odisha", "country": "India", "latitude": 20.2589, "longitude": 85.7865},
    {"name": "Cuttack Badambadi", "area": "Bus Terminal", "city": "Cuttack", "state": "Odisha", "country": "India", "latitude": 20.4625, "longitude": 85.8828},
    {"name": "Puri Beach Road", "area": "Coastal Zone", "city": "Puri", "state": "Odisha", "country": "India", "latitude": 19.8135, "longitude": 85.8312},
    {"name": "Rourkela Steel City", "area": "Industrial Sector", "city": "Rourkela", "state": "Odisha", "country": "India", "latitude": 22.2604, "longitude": 84.8536},
    {"name": "Bengaluru - Whitefield", "area": "IT Park", "city": "Bengaluru", "state": "Karnataka", "country": "India", "latitude": 12.9698, "longitude": 77.7500},
    {"name": "Delhi - Anand Vihar", "area": "Trans-Yamuna", "city": "Delhi", "state": "Delhi", "country": "India", "latitude": 28.6469, "longitude": 77.3160},
    {"name": "Delhi - Connaught Place", "area": "Central Delhi", "city": "Delhi", "state": "Delhi", "country": "India", "latitude": 28.6304, "longitude": 77.2177},
    {"name": "Mumbai - Bandra Kurla", "area": "Financial District", "city": "Mumbai", "state": "Maharashtra", "country": "India", "latitude": 19.0657, "longitude": 72.8687},
    {"name": "Kolkata - Salt Lake", "area": "Sector V", "city": "Kolkata", "state": "West Bengal", "country": "India", "latitude": 22.5867, "longitude": 88.4178},
    {"name": "Hyderabad - Hitec City", "area": "Cyberabad", "city": "Hyderabad", "state": "Telangana", "country": "India", "latitude": 17.4435, "longitude": 78.3772},
    {"name": "Chennai - Guindy", "area": "South Zone", "city": "Chennai", "state": "Tamil Nadu", "country": "India", "latitude": 13.0067, "longitude": 80.2025},
    {"name": "London - Westminster", "area": "Central London", "city": "London", "state": "England", "country": "UK", "latitude": 51.4975, "longitude": -0.1357},
    {"name": "New York - Central Park", "area": "Manhattan", "city": "New York", "state": "NY", "country": "USA", "latitude": 40.785091, "longitude": -73.968285},
    {"name": "Tokyo - Shinjuku", "area": "Metropolitan", "city": "Tokyo", "state": "Tokyo", "country": "Japan", "latitude": 35.6938, "longitude": 139.7034},
]

def calculate_distance_km(lat1, lon1, lat2, lon2):
    """Haversine formula to compute geographical distance in km."""
    r = 6371.0 # Earth radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 2)

def get_alphabetical_locations():
    """Returns all available locations sorted strictly in alphabetical order by name."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name, area, city, state, country, latitude, longitude FROM locations ORDER BY name ASC")
        rows = cursor.fetchall()
        conn.close()
        if rows:
            return [dict(row) for row in rows]
    except Exception:
        pass
    
    # Fallback to in-memory list sorted alphabetically
    return sorted(DEFAULT_LOCATIONS, key=lambda x: x["name"].lower())

def search_locations(query=""):
    """Searches locations by name, city, state or area."""
    query = (query or "").strip().lower()
    all_locs = get_alphabetical_locations()
    if not query:
        return all_locs
    return [
        loc for loc in all_locs
        if query in loc["name"].lower() or query in loc["city"].lower() or query in loc["area"].lower()
    ]

def get_location_by_name(name):
    """Fetches a specific location by name, case-insensitive."""
    all_locs = get_alphabetical_locations()
    target = name.strip().lower()
    for loc in all_locs:
        if loc["name"].lower() == target or loc["city"].lower() == target:
            return loc
    # If not found in database, try geocoding
    geocoded = geocode_address(name)
    if geocoded:
        return geocoded
    return DEFAULT_LOCATIONS[0]

def geocode_address(address_str):
    """Uses Open-Meteo free geocoding API to resolve coordinates."""
    try:
        encoded = urllib.parse.quote(address_str)
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={encoded}&count=1&language=en&format=json"
        req = urllib.request.Request(url, headers={"User-Agent": "AtmoSheild/1.0"})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode())
            if "results" in data and len(data["results"]) > 0:
                res = data["results"][0]
                return {
                    "name": res.get("name", address_str),
                    "area": res.get("admin1", res.get("name")),
                    "city": res.get("name", address_str),
                    "state": res.get("admin1", ""),
                    "country": res.get("country", ""),
                    "latitude": res.get("latitude"),
                    "longitude": res.get("longitude")
                }
    except Exception:
        pass
    return None

def get_nearby_stations(lat, lon, limit=4):
    """Finds stations near given latitude and longitude sorted by proximity."""
    all_locs = get_alphabetical_locations()
    with_distances = []
    for loc in all_locs:
        dist = calculate_distance_km(lat, lon, loc["latitude"], loc["longitude"])
        # We include nearby points (exclude the exact same spot if distance < 0.1, or include it)
        with_distances.append({
            **loc,
            "distance_km": dist
        })
    with_distances.sort(key=lambda x: x["distance_km"])
    return with_distances[:limit]
