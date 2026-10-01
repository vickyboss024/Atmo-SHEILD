"""
Weather Service for Atmo SHEILD
Fetches live atmospheric parameters (Temperature, Humidity, Wind speed, Condition).
If live data is unavailable, clearly indicates 'Data unavailable' rather than fake readings.
"""

import json
import urllib.request

WEATHER_CODE_MAP = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow Fall",
    73: "Moderate Snow Fall",
    75: "Heavy Snow Fall",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Heavy Hail",
}

def fetch_live_weather(latitude, longitude):
    """
    Fetches real-time weather from Open-Meteo Weather API.
    Returns structured dictionary or 'Data unavailable'.
    """
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}&current="
        f"temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto"
    )
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "AtmoSheild/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status != 200:
                return {"status": "unavailable", "message": "Data unavailable"}
            data = json.loads(response.read().decode())
            current = data.get("current", {})
            if not current:
                return {"status": "unavailable", "message": "Data unavailable"}

            temp = current.get("temperature_2m")
            humidity = current.get("relative_humidity_2m")
            wind_speed = current.get("wind_speed_10m")
            code = current.get("weather_code", 0)
            condition = WEATHER_CODE_MAP.get(code, "Partly Cloudy")

            return {
                "status": "available",
                "temperature": round(temp, 1) if temp is not None else None,
                "humidity": round(humidity) if humidity is not None else None,
                "wind_speed": round(wind_speed, 1) if wind_speed is not None else None,
                "weather_condition": condition,
                "source": "Open-Meteo Meteorological Feed"
            }
    except Exception as e:
        return {
            "status": "unavailable",
            "message": "Data unavailable",
            "error_detail": str(e)
        }
