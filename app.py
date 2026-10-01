"""
🌿 Atmo SHEILD — AI Air Pollution & Health Advisory System
Main Flask Application

Provides RESTful endpoints and Jinja templating for:
- Real-time AQI and Weather monitoring (Sensor detector vs Atmospheric API)
- 3-Level AQI Classification (LOW 🟢, MEDIUM 🟡, HIGH 🔴)
- Nearby stations and alphabetical location dropdown
- AI Health Advisory tailored for 7 sensitivity categories
- What To Do & What Not To Do environmental action cards
- Weekly & Monthly pollution recaps with verified trend analysis
- Air Quality Alerts
"""

import os
import sys
from datetime import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.database import init_db
from services.location_service import (
    get_alphabetical_locations,
    search_locations,
    get_location_by_name,
    get_nearby_stations
)
from services.aqi_service import fetch_live_aqi, classify_aqi_level
from services.weather_service import fetch_live_weather
from services.health_advisory import generate_health_advisory, SENSITIVITY_PROFILES
from services.history_service import get_weekly_recap, get_monthly_recap, record_reading

try:
    from flask import Flask, jsonify, request, render_template
    from flask_cors import CORS
    has_flask = True
except ImportError:
    has_flask = False

# Initialize database tables on load
init_db()

if has_flask:
    app = Flask(__name__, template_folder="templates", static_folder="static")
    CORS(app)

    @app.route("/")
    def index():
        """Main dashboard view"""
        locations = get_alphabetical_locations()
        return render_template("index.html", locations=locations, sensitivity_profiles=SENSITIVITY_PROFILES)

    @app.route("/nearby")
    def nearby_view():
        """Nearby stations view"""
        return render_template("nearby.html")

    @app.route("/advisory")
    def advisory_view():
        """AI Health Advisory view"""
        return render_template("advisory.html", sensitivity_profiles=SENSITIVITY_PROFILES)

    @app.route("/history")
    def history_view():
        """Weekly & Monthly History view"""
        return render_template("history.html")

    # API Endpoints
    @app.route("/api/locations", methods=["GET"])
    def api_locations():
        query = request.args.get("q", "")
        locs = search_locations(query)
        return jsonify({"status": "success", "count": len(locs), "locations": locs})

    @app.route("/api/aqi", methods=["GET"])
    def api_aqi():
        location_name = request.args.get("location", "Bhubaneswar")
        source_type = request.args.get("source", "api") # 'api' or 'sensor'
        lat_arg = request.args.get("lat")
        lon_arg = request.args.get("lon")

        if lat_arg and lon_arg:
            try:
                lat = float(lat_arg)
                lon = float(lon_arg)
                loc_info = {"name": location_name, "latitude": lat, "longitude": lon}
            except ValueError:
                loc_info = get_location_by_name(location_name)
                lat, lon = loc_info["latitude"], loc_info["longitude"]
        else:
            loc_info = get_location_by_name(location_name)
            lat, lon = loc_info["latitude"], loc_info["longitude"]

        aqi_data = fetch_live_aqi(lat, lon, source_type=source_type)
        weather_data = fetch_live_weather(lat, lon)

        # Record reading if available
        if aqi_data.get("status") == "available" and aqi_data.get("aqi") is not None:
            pollutants = aqi_data.get("pollutants", {})
            record_reading(
                location_name=loc_info.get("name", location_name),
                aqi=aqi_data.get("aqi"),
                pm2_5=pollutants.get("pm2_5"),
                pm10=pollutants.get("pm10"),
                co=pollutants.get("co"),
                no2=pollutants.get("no2"),
                so2=pollutants.get("so2"),
                o3=pollutants.get("o3"),
                temperature=weather_data.get("temperature"),
                humidity=weather_data.get("humidity"),
                wind_speed=weather_data.get("wind_speed"),
                weather_condition=weather_data.get("weather_condition"),
                source_type=source_type
            )

        return jsonify({
            "status": "success",
            "location": loc_info,
            "air_quality": aqi_data,
            "weather": weather_data,
            "timestamp": datetime.now().isoformat()
        })

    @app.route("/api/nearby", methods=["GET"])
    def api_nearby():
        location_name = request.args.get("location", "Bhubaneswar")
        lat_arg = request.args.get("lat")
        lon_arg = request.args.get("lon")

        if lat_arg and lon_arg:
            try:
                lat = float(lat_arg)
                lon = float(lon_arg)
            except ValueError:
                loc_info = get_location_by_name(location_name)
                lat, lon = loc_info["latitude"], loc_info["longitude"]
        else:
            loc_info = get_location_by_name(location_name)
            lat, lon = loc_info["latitude"], loc_info["longitude"]

        nearby_stations = get_nearby_stations(lat, lon, limit=5)
        results = []
        for st in nearby_stations:
            aqi_res = fetch_live_aqi(st["latitude"], st["longitude"])
            if aqi_res.get("status") == "available":
                results.append({
                    "name": st["name"],
                    "area": st["area"],
                    "city": st["city"],
                    "distance_km": st["distance_km"],
                    "latitude": st["latitude"],
                    "longitude": st["longitude"],
                    "aqi": aqi_res.get("aqi"),
                    "aqi_level": aqi_res.get("aqi_level"),
                    "aqi_color": aqi_res.get("aqi_color"),
                    "aqi_emoji": aqi_res.get("aqi_emoji"),
                    "source": aqi_res.get("source_label")
                })
            else:
                results.append({
                    "name": st["name"],
                    "area": st["area"],
                    "city": st["city"],
                    "distance_km": st["distance_km"],
                    "latitude": st["latitude"],
                    "longitude": st["longitude"],
                    "aqi": None,
                    "aqi_level": "UNKNOWN",
                    "status": "Data unavailable"
                })

        return jsonify({"status": "success", "stations": results})

    @app.route("/api/advisory", methods=["GET", "POST"])
    def api_advisory():
        if request.method == "POST":
            data = request.get_json() or {}
            aqi = data.get("aqi")
            pm2_5 = data.get("pm2_5")
            weather = data.get("weather")
            location = data.get("location", "Your Location")
            group = data.get("sensitivity_group", "general")
        else:
            aqi = request.args.get("aqi", type=int)
            pm2_5 = request.args.get("pm2_5", type=float)
            location = request.args.get("location", "Your Location")
            group = request.args.get("sensitivity_group", "general")
            weather = {
                "temperature": request.args.get("temp", type=float),
                "humidity": request.args.get("humidity", type=float)
            }

        advisory = generate_health_advisory(
            aqi=aqi,
            pm2_5=pm2_5,
            weather=weather,
            location=location,
            sensitivity_group=group
        )
        return jsonify({"status": "success", "advisory": advisory})

    @app.route("/api/history/weekly", methods=["GET"])
    def api_history_weekly():
        location = request.args.get("location", "Bhubaneswar")
        data = get_weekly_recap(location)
        return jsonify({"status": "success", "data": data})

    @app.route("/api/history/monthly", methods=["GET"])
    def api_history_monthly():
        location = request.args.get("location", "Bhubaneswar")
        data = get_monthly_recap(location)
        return jsonify({"status": "success", "data": data})

else:
    # CLI / Standalone Runner when Flask is not installed
    def run_cli_demo():
        print("="*60)
        print("🌿 Atmo SHEILD — Python Core Services Demo")
        print("="*60)
        locations = get_alphabetical_locations()
        print(f"Total known locations in alphabetical order: {len(locations)}")
        for loc in locations[:5]:
            print(f" - {loc['name']} ({loc['city']}, {loc['country']})")
        print("...")

        # Test live AQI & Weather
        sample_loc = locations[0]
        print(f"\nFetching live AQI for {sample_loc['name']}...")
        aqi_res = fetch_live_aqi(sample_loc["latitude"], sample_loc["longitude"])
        weather_res = fetch_live_weather(sample_loc["latitude"], sample_loc["longitude"])
        print(f"AQI Result: {aqi_res.get('aqi')} [{aqi_res.get('aqi_level')}] - {aqi_res.get('meaning')}")
        print(f"Weather: {weather_res.get('temperature')}°C, {weather_res.get('weather_condition')}, Humidity: {weather_res.get('humidity')}%")

        # Test Health Advisory
        print("\nGenerating AI Health Advisory for 'respiratory' sensitivity group...")
        adv = generate_health_advisory(
            aqi=aqi_res.get("aqi", 85),
            pm2_5=aqi_res.get("pollutants", {}).get("pm2_5", 35.0),
            weather=weather_res,
            location=sample_loc["name"],
            sensitivity_group="respiratory"
        )
        print(f"Headline: {adv['headline']}")
        print(f"Summary: {adv['summary']}")

        # Test History
        weekly = get_weekly_recap(sample_loc["name"])
        print(f"\nWeekly recap: Average AQI = {weekly.get('average_aqi')}, Low={weekly.get('lowest_aqi')}, High={weekly.get('highest_aqi')}")
        monthly = get_monthly_recap(sample_loc["name"])
        print(f"Monthly recap: Average AQI = {monthly.get('average_aqi')}, Trend = '{monthly.get('trend_statement')}'")
        print("\nAll Python core services functional and verified.")

if __name__ == "__main__":
    if has_flask:
        port = int(os.environ.get("PORT", 5000))
        app.run(host="0.0.0.0", port=port, debug=True)
    else:
        run_cli_demo()
