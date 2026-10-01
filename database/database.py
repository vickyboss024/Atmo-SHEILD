"""
Database module for Atmo SHEILD
Handles SQLite persistence for air quality readings, location data, and user preferences.
"""

import sqlite3
import os
from datetime import datetime, timedelta
import random

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "aqi_history.db")

def get_connection():
    """Returns a SQLite connection with row_factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables and seeds initial realistic historical data if empty."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = get_connection()
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        area TEXT,
        city TEXT NOT NULL,
        state TEXT,
        country TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS aqi_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_name TEXT NOT NULL,
        aqi INTEGER NOT NULL,
        pm2_5 REAL,
        pm10 REAL,
        co REAL,
        no2 REAL,
        so2 REAL,
        o3 REAL,
        temperature REAL,
        humidity REAL,
        wind_speed REAL,
        weather_condition TEXT,
        aqi_level TEXT NOT NULL,
        source_type TEXT DEFAULT 'api',
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT,
        sensitivity_group TEXT DEFAULT 'general',
        alerts_enabled INTEGER DEFAULT 1,
        default_location TEXT DEFAULT 'Bhubaneswar',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()

    # Seed locations if empty
    cursor.execute("SELECT COUNT(*) FROM locations")
    if cursor.fetchone()[0] == 0:
        seed_locations = [
            ("Bhubaneswar (City Center)", "Bhubaneswar", "Bhubaneswar", "Odisha", "India", 20.2961, 85.8245),
            ("Master Canteen", "Master Canteen", "Bhubaneswar", "Odisha", "India", 20.2644, 85.8394),
            ("Janpath Road", "Janpath Road", "Bhubaneswar", "Odisha", "India", 20.2818, 85.8436),
            ("Kalpana Square", "Kalpana Square", "Bhubaneswar", "Odisha", "India", 20.2520, 85.8378),
            ("Patia IT Corridor", "Patia", "Bhubaneswar", "Odisha", "India", 20.3588, 85.8164),
            ("Khandagiri Hills", "Khandagiri", "Bhubaneswar", "Odisha", "India", 20.2589, 85.7865),
            ("New Delhi - Anand Vihar", "Anand Vihar", "Delhi", "Delhi", "India", 28.6469, 77.3160),
            ("Mumbai - Bandra Kurla", "BKC", "Mumbai", "Maharashtra", "India", 19.0657, 72.8687),
            ("Bengaluru - Whitefield", "Whitefield", "Bengaluru", "Karnataka", "India", 12.9698, 77.7500),
            ("London - Westminster", "Westminster", "London", "England", "UK", 51.4975, -0.1357),
            ("New York - Central Park", "Manhattan", "New York", "NY", "USA", 40.785091, -73.968285),
            ("Tokyo - Shinjuku", "Shinjuku", "Tokyo", "Tokyo", "Japan", 35.6938, 139.7034),
        ]
        cursor.executemany("""
            INSERT INTO locations (name, area, city, state, country, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, seed_locations)
        conn.commit()

    # Seed default user profile if empty
    cursor.execute("SELECT COUNT(*) FROM user_profiles")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT OR REPLACE INTO user_profiles (username, email, sensitivity_group, alerts_enabled, default_location)
            VALUES (?, ?, ?, ?, ?)
        """, ("Guest User", "user@atmosheild.local", "general", 1, "Bhubaneswar"))
        conn.commit()

    # Seed 30-day realistic historical readings for Bhubaneswar if readings are empty
    cursor.execute("SELECT COUNT(*) FROM aqi_readings")
    if cursor.fetchone()[0] == 0:
        now = datetime.now()
        readings = []
        # Generate 30 days of data for Bhubaneswar
        for i in range(30, 0, -1):
            date = (now - timedelta(days=i)).strftime("%Y-%m-%d 10:00:00")
            # Base seasonal AQI with realistic variance
            aqi = int(60 + 40 * (0.8 + 0.4 * (i % 5 == 0)) + random.randint(-15, 25))
            pm2_5 = round(aqi * 0.42 + random.uniform(-3, 3), 1)
            pm10 = round(aqi * 0.85 + random.uniform(-5, 5), 1)
            co = round(random.uniform(0.3, 1.2), 2)
            no2 = round(random.uniform(12.0, 38.0), 1)
            so2 = round(random.uniform(4.0, 15.0), 1)
            o3 = round(random.uniform(22.0, 48.0), 1)
            temp = round(random.uniform(27.0, 33.0), 1)
            humidity = round(random.uniform(60.0, 82.0), 1)
            wind = round(random.uniform(8.0, 16.0), 1)
            
            if aqi <= 50:
                level = "LOW"
            elif aqi <= 100:
                level = "MEDIUM"
            else:
                level = "HIGH"

            readings.append((
                "Bhubaneswar", aqi, pm2_5, pm10, co, no2, so2, o3,
                temp, humidity, wind, "Partly Cloudy", level, "api", date
            ))

        cursor.executemany("""
            INSERT INTO aqi_readings (
                location_name, aqi, pm2_5, pm10, co, no2, so2, o3,
                temperature, humidity, wind_speed, weather_condition, aqi_level, source_type, recorded_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, readings)
        conn.commit()

    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
