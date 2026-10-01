"""
History Service for Atmo SHEILD
Computes Weekly and Monthly Air Quality Recaps, trends, and persists sensor readings into SQLite.
"""

from datetime import datetime, timedelta
from database.database import get_connection

def record_reading(location_name, aqi, pm2_5=None, pm10=None, co=None, no2=None, so2=None, o3=None,
                   temperature=None, humidity=None, wind_speed=None, weather_condition=None,
                   source_type="api"):
    """Saves a new air quality reading into the SQLite database."""
    if aqi is None:
        return False
    
    if aqi <= 50:
        level = "LOW"
    elif aqi <= 100:
        level = "MEDIUM"
    else:
        level = "HIGH"

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO aqi_readings (
                location_name, aqi, pm2_5, pm10, co, no2, so2, o3,
                temperature, humidity, wind_speed, weather_condition,
                aqi_level, source_type, recorded_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            location_name, int(aqi), pm2_5, pm10, co, no2, so2, o3,
            temperature, humidity, wind_speed, weather_condition,
            level, source_type, datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving reading: {e}")
        return False

def get_weekly_recap(location_name="Bhubaneswar"):
    """
    Computes weekly statistics:
    - Average AQI
    - Lowest AQI
    - Highest AQI
    - Number of LOW days, MEDIUM days, HIGH days
    - Average PM2.5
    - Daily readings for line chart
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Query last 7 days of daily averages or readings
    seven_days_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        SELECT aqi, pm2_5, aqi_level, recorded_at, weather_condition, temperature
        FROM aqi_readings
        WHERE (location_name LIKE ? OR location_name = 'Bhubaneswar')
          AND recorded_at >= ?
        ORDER BY recorded_at ASC
    """, (f"%{location_name}%", seven_days_ago))
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        # Fallback query if no recent records within 7 days
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT aqi, pm2_5, aqi_level, recorded_at, weather_condition, temperature
            FROM aqi_readings
            ORDER BY recorded_at DESC
            LIMIT 7
        """)
        rows = list(reversed(cursor.fetchall()))
        conn.close()

    if not rows:
        return {
            "status": "unavailable",
            "message": "No historical data available for this location."
        }

    aqi_values = [r["aqi"] for r in rows if r["aqi"] is not None]
    pm25_values = [r["pm2_5"] for r in rows if r["pm2_5"] is not None]
    
    if not aqi_values:
        return {"status": "unavailable", "message": "No historical data available"}

    avg_aqi = round(sum(aqi_values) / len(aqi_values))
    lowest_aqi = min(aqi_values)
    highest_aqi = max(aqi_values)
    avg_pm25 = round(sum(pm25_values) / len(pm25_values), 1) if pm25_values else 0.0

    low_days = sum(1 for val in aqi_values if val <= 50)
    medium_days = sum(1 for val in aqi_values if 51 <= val <= 100)
    high_days = sum(1 for val in aqi_values if val > 100)

    # Format chart points (Day name, Date, AQI, Level)
    chart_data = []
    for r in rows:
        dt = datetime.strptime(r["recorded_at"], "%Y-%m-%d %H:%M:%S") if " " in str(r["recorded_at"]) else datetime.now()
        chart_data.append({
            "day": dt.strftime("%a"),
            "date": dt.strftime("%b %d"),
            "aqi": r["aqi"],
            "level": r["aqi_level"],
            "pm2_5": r["pm2_5"]
        })

    return {
        "status": "available",
        "timeframe": "THIS WEEK",
        "average_aqi": avg_aqi,
        "lowest_aqi": lowest_aqi,
        "highest_aqi": highest_aqi,
        "average_pm2_5": avg_pm25,
        "low_days": low_days,
        "medium_days": medium_days,
        "high_days": high_days,
        "chart_data": chart_data
    }

def get_monthly_recap(location_name="Bhubaneswar"):
    """
    Computes monthly statistics:
    - Monthly average AQI
    - Highest pollution day & Lowest pollution day
    - Number of high-AQI days
    - PM2.5 trend
    - Comparison with previous period (strictly backed by stored data)
    """
    conn = get_connection()
    cursor = conn.cursor()

    thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        SELECT aqi, pm2_5, aqi_level, recorded_at
        FROM aqi_readings
        WHERE (location_name LIKE ? OR location_name = 'Bhubaneswar')
          AND recorded_at >= ?
        ORDER BY recorded_at ASC
    """, (f"%{location_name}%", thirty_days_ago))
    current_month_rows = cursor.fetchall()

    # Query previous 30 days (day 31 to 60) for genuine comparative trend
    sixty_days_ago = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        SELECT aqi
        FROM aqi_readings
        WHERE (location_name LIKE ? OR location_name = 'Bhubaneswar')
          AND recorded_at >= ? AND recorded_at < ?
    """, (f"%{location_name}%", sixty_days_ago, thirty_days_ago))
    prev_month_rows = cursor.fetchall()
    conn.close()

    if not current_month_rows:
        return {
            "status": "unavailable",
            "message": "Monthly historical data unavailable."
        }

    aqi_list = [r["aqi"] for r in current_month_rows if r["aqi"] is not None]
    pm25_list = [r["pm2_5"] for r in current_month_rows if r["pm2_5"] is not None]

    if not aqi_list:
        return {"status": "unavailable", "message": "Monthly historical data unavailable"}

    avg_aqi = round(sum(aqi_list) / len(aqi_list))
    high_days_count = sum(1 for val in aqi_list if val > 100)

    # Find highest and lowest days
    highest_row = max(current_month_rows, key=lambda x: x["aqi"])
    lowest_row = min(current_month_rows, key=lambda x: x["aqi"])

    highest_date = highest_row["recorded_at"][:10]
    lowest_date = lowest_row["recorded_at"][:10]

    # Genuine comparison with stored previous data
    trend_statement = "Insufficient historical data for month-over-month comparison."
    trend_type = "neutral"

    if prev_month_rows:
        prev_aqis = [r["aqi"] for r in prev_month_rows if r["aqi"] is not None]
        if prev_aqis:
            prev_avg = sum(prev_aqis) / len(prev_aqis)
            diff = avg_aqi - prev_avg
            if diff < -2.0:
                trend_statement = f"AQI improved by {round(abs(diff))} points compared with last month"
                trend_type = "improved"
            elif diff > 2.0:
                trend_statement = f"AQI worsened by {round(diff)} points compared with last month"
                trend_type = "worsened"
            else:
                trend_statement = "AQI remained stable compared with last month"
                trend_type = "stable"
    else:
        # Evaluate first half vs second half of the month if only 30 days present
        if len(aqi_list) >= 14:
            mid = len(aqi_list) // 2
            first_half_avg = sum(aqi_list[:mid]) / mid
            second_half_avg = sum(aqi_list[mid:]) / (len(aqi_list) - mid)
            diff = second_half_avg - first_half_avg
            if diff < -2.0:
                trend_statement = f"AQI improved over the past two weeks ({round(abs(diff))} pts lower)"
                trend_type = "improved"
            elif diff > 2.0:
                trend_statement = f"AQI trended higher over the past two weeks ({round(diff)} pts higher)"
                trend_type = "worsened"
            else:
                trend_statement = "AQI stayed consistent across the recorded period"
                trend_type = "stable"

    # Monthly chart data (aggregated every 3-4 days or all days)
    chart_data = []
    for r in current_month_rows:
        dt = datetime.strptime(r["recorded_at"], "%Y-%m-%d %H:%M:%S") if " " in str(r["recorded_at"]) else datetime.now()
        chart_data.append({
            "date": dt.strftime("%b %d"),
            "aqi": r["aqi"],
            "pm2_5": r["pm2_5"],
            "level": r["aqi_level"]
        })

    month_name = datetime.now().strftime("%B")

    return {
        "status": "available",
        "month_label": f"{month_name} Air Quality",
        "average_aqi": avg_aqi,
        "highest_pollution_day": {
            "date": highest_date,
            "aqi": highest_row["aqi"]
        },
        "lowest_pollution_day": {
            "date": lowest_date,
            "aqi": lowest_row["aqi"]
        },
        "high_aqi_days": high_days_count,
        "trend_statement": trend_statement,
        "trend_type": trend_type,
        "chart_data": chart_data
    }
