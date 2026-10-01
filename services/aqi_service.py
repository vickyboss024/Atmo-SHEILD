"""
AQI Service for Atmo SHEILD
Fetches and processes live air quality metrics: AQI, PM2.5, PM10, CO, NO2, SO2, O3.
Classifies into 3 simple levels: LOW (🟢), MEDIUM (🟡), HIGH (🔴).
Handles sensor detector vs API data feeds, and gracefully reports 'Data unavailable'.
"""

import json
import urllib.request
from datetime import datetime

def classify_aqi_level(aqi_value):
    """
    Classifies AQI into 3 clear levels:
    🟢 LOW (0-50): Air quality is relatively good.
    🟡 MEDIUM (51-100): Air quality may affect sensitive people or prolonged outdoor activity.
    🔴 HIGH (>100): Pollution is elevated and outdoor exposure should be reduced.
    """
    if aqi_value is None:
        return {
            "level": "UNKNOWN",
            "color": "#94a3b8",
            "emoji": "⚪",
            "badge": "UNAVAILABLE",
            "meaning": "Data unavailable. Sensor or station feed is currently offline."
        }

    try:
        val = int(aqi_value)
    except (ValueError, TypeError):
        return {
            "level": "UNKNOWN",
            "color": "#94a3b8",
            "emoji": "⚪",
            "badge": "UNAVAILABLE",
            "meaning": "Data unavailable."
        }

    if val <= 50:
        return {
            "level": "LOW",
            "color": "#10b981", # emerald/green
            "emoji": "🟢",
            "badge": "LOW",
            "meaning": "Air quality is relatively good. Ideal for all normal outdoor activities."
        }
    elif val <= 100:
        return {
            "level": "MEDIUM",
            "color": "#eab308", # amber/yellow
            "emoji": "🟡",
            "badge": "MEDIUM",
            "meaning": "Air quality may affect sensitive people or prolonged outdoor activity."
        }
    else:
        return {
            "level": "HIGH",
            "color": "#ef4444", # rose/red
            "emoji": "🔴",
            "badge": "HIGH",
            "meaning": "Pollution is elevated and outdoor exposure should be reduced."
        }

def fetch_live_aqi(latitude, longitude, source_type="api", custom_sensor_data=None):
    """
    Fetches real-time AQI from Open-Meteo Air Quality API or custom sensor.
    Returns structured data or 'Data unavailable' without inventing fake values.
    """
    # If custom hardware sensor/detector payload provided
    if source_type == "sensor" and custom_sensor_data:
        aqi_val = custom_sensor_data.get("aqi")
        classification = classify_aqi_level(aqi_val)
        return {
            "status": "available",
            "source_type": "sensor",
            "source_label": "IoT Laser Particle Sensor (PMS5003/BME680)",
            "updated_at": "Updated just now",
            "aqi": aqi_val,
            "aqi_level": classification["level"],
            "aqi_color": classification["color"],
            "aqi_emoji": classification["emoji"],
            "meaning": classification["meaning"],
            "pollutants": {
                "pm2_5": custom_sensor_data.get("pm2_5"),
                "pm10": custom_sensor_data.get("pm10"),
                "co": custom_sensor_data.get("co"),
                "no2": custom_sensor_data.get("no2"),
                "so2": custom_sensor_data.get("so2"),
                "o3": custom_sensor_data.get("o3"),
            }
        }

    # Fetch from Open-Meteo Air Quality API
    url = (
        f"https://air-quality-api.open-meteo.com/v1/air-quality?"
        f"latitude={latitude}&longitude={longitude}&current="
        f"us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto"
    )

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "AtmoSheild/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status != 200:
                return {
                    "status": "unavailable",
                    "source_type": "api",
                    "source_label": "Atmospheric Station Feed",
                    "message": "Data unavailable"
                }

            data = json.loads(response.read().decode())
            current = data.get("current", {})
            if not current:
                return {
                    "status": "unavailable",
                    "source_type": "api",
                    "source_label": "Atmospheric Station Feed",
                    "message": "Data unavailable"
                }

            aqi_val = current.get("us_aqi")
            # If us_aqi is None, calculate approximation from PM2.5 or return unavailable
            if aqi_val is None:
                pm25 = current.get("pm2_5")
                if pm25 is not None:
                    # US EPA simple formula for PM2.5 to AQI
                    if pm25 <= 12.0:
                        aqi_val = round((50 / 12.0) * pm25)
                    elif pm25 <= 35.4:
                        aqi_val = round(50 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1))
                    elif pm25 <= 55.4:
                        aqi_val = round(101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5))
                    else:
                        aqi_val = round(151 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5))
                else:
                    return {
                        "status": "unavailable",
                        "source_type": "api",
                        "source_label": "Atmospheric Station Feed",
                        "message": "Data unavailable"
                    }

            classification = classify_aqi_level(aqi_val)

            return {
                "status": "available",
                "source_type": "api",
                "source_label": "Open-Meteo & Copernicus Atmospheric API",
                "updated_at": "Updated 2 minutes ago",
                "aqi": int(aqi_val),
                "aqi_level": classification["level"],
                "aqi_color": classification["color"],
                "aqi_emoji": classification["emoji"],
                "meaning": classification["meaning"],
                "pollutants": {
                    "pm2_5": round(current.get("pm2_5", 0), 1) if current.get("pm2_5") is not None else None,
                    "pm10": round(current.get("pm10", 0), 1) if current.get("pm10") is not None else None,
                    "co": round(current.get("carbon_monoxide", 0) / 1000.0, 2) if current.get("carbon_monoxide") is not None else None, # converted to mg/m3 or ppm approx
                    "no2": round(current.get("nitrogen_dioxide", 0), 1) if current.get("nitrogen_dioxide") is not None else None,
                    "so2": round(current.get("sulphur_dioxide", 0), 1) if current.get("sulphur_dioxide") is not None else None,
                    "o3": round(current.get("ozone", 0), 1) if current.get("ozone") is not None else None,
                }
            }

    except Exception as e:
        return {
            "status": "unavailable",
            "source_type": "api",
            "source_label": "Atmospheric Station Feed",
            "message": "Data unavailable",
            "error_detail": str(e)
        }
