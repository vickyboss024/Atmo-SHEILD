"""
AI Health Advisory Service for Atmo SHEILD
Generates clear, actionable environmental health precautions based on:
- AQI level & PM2.5
- Weather factors (temperature, humidity, wind)
- User sensitivity profile:
  1. 👤 General Public
  2. 👶 Children
  3. 👵 Elderly
  4. 🫁 Respiratory-sensitive
  5. 🏃 Outdoor/Sports
  6. 👷 Outdoor Worker
  7. 🌾 Farming and Pet Animals

NOTE: The system provides general environmental health guidance and does not diagnose diseases.
"""

SENSITIVITY_PROFILES = {
    "general": {
        "id": "general",
        "name": "General Public",
        "emoji": "👤",
        "desc": "Healthy individuals with typical daily routines."
    },
    "children": {
        "id": "children",
        "name": "Children",
        "emoji": "👶",
        "desc": "Developing lungs with higher respiratory volume per kg body weight."
    },
    "elderly": {
        "id": "elderly",
        "name": "Elderly",
        "emoji": "👵",
        "desc": "Seniors (65+) and those with aging cardiovascular defenses."
    },
    "respiratory": {
        "id": "respiratory",
        "name": "Respiratory-sensitive",
        "emoji": "🫁",
        "desc": "Individuals with asthma, allergies, bronchitis, or COPD."
    },
    "outdoor_sports": {
        "id": "outdoor_sports",
        "name": "Outdoor / Sports",
        "emoji": "🏃",
        "desc": "Runners, cyclists, and athletes inhaling high volumes of air."
    },
    "outdoor_worker": {
        "id": "outdoor_worker",
        "name": "Outdoor Worker",
        "emoji": "👷",
        "desc": "Construction, traffic officers, street vendors, delivery personnel."
    },
    "farming_pets": {
        "id": "farming_pets",
        "name": "Farming & Pet Animals",
        "emoji": "🌾",
        "desc": "Agricultural operators, farm animals, domestic dogs/cats, and livestock."
    }
}

DEFAULT_DOS = [
    {"icon": "💧", "title": "Stay hydrated", "desc": "Drink plenty of water to keep airway mucus membranes moist and effective at filtering particulates."},
    {"icon": "😷", "title": "Consider respiratory protection", "desc": "Wear a well-fitted N95 / KN95 particulate respirator when AQI is elevated."},
    {"icon": "🏠", "title": "Keep indoor air clean", "desc": "Keep windows closed during peak traffic hours; use HEPA purifiers or moist mopping indoors."},
    {"icon": "🌬️", "title": "Check AQI before going outside", "desc": "Check Atmo SHEILD hourly updates to plan morning walks or errands during cleaner windows."},
    {"icon": "🏃", "title": "Reduce strenuous activity when high", "desc": "Shift high-intensity workouts indoors or reschedule to early morning when dispersion is better."}
]

DEFAULT_DONTS = [
    {"icon": "🚫", "title": "Avoid unnecessary prolonged outdoor exposure", "desc": "Limit time spent outdoors during stagnant, smoggy peak afternoon or evening hours."},
    {"icon": "🚷", "title": "Avoid strenuous exercise when AQI is high", "desc": "Deep aerobic breathing pulls particulate matter twice as deep into bronchial alveoli."},
    {"icon": "🚗", "title": "Avoid heavy traffic intersections", "desc": "Exhaust fumes contain concentrated NO2 and ultrafine particles that irritate respiratory tracts."},
    {"icon": "⚠️", "title": "Do not ignore severe pollution alerts", "desc": "Follow local air quality advisories and ensure emergency inhalers or medications are at hand."}
]

def generate_health_advisory(aqi, pm2_5=None, weather=None, location="Your Location", sensitivity_group="general"):
    """
    Generates tailored advice based on AQI, weather, and sensitivity group.
    """
    profile = SENSITIVITY_PROFILES.get(sensitivity_group, SENSITIVITY_PROFILES["general"])
    
    if aqi is None:
        return {
            "aqi_level": "UNKNOWN",
            "sensitivity_group": profile,
            "headline": "Air quality data currently unavailable",
            "summary": "We are unable to receive live sensor readings for this area. Please exercise standard environmental caution.",
            "what_to_do": DEFAULT_DOS,
            "what_not_to_do": DEFAULT_DONTS,
            "disclaimer": "The system provides general health information and does not diagnose diseases."
        }

    try:
        val = int(aqi)
    except (ValueError, TypeError):
        val = 0

    temp = weather.get("temperature") if weather else None
    humidity = weather.get("humidity") if weather else None

    # Advisory generation logic by AQI category and Sensitivity Group
    if val <= 50:
        level = "LOW"
        color = "#10b981"
        emoji = "🟢"
        
        if sensitivity_group == "children":
            headline = "🟢 Clean Air: Safe for Outdoor Play"
            summary = f"Air quality in {location} is pristine. Children can safely play outdoors in parks and sports fields."
        elif sensitivity_group == "elderly":
            headline = "🟢 Healthy Air: Ideal for Morning Walks"
            summary = f"Air pollution levels in {location} are low. Great day for walks, gardening, and natural ventilation."
        elif sensitivity_group == "respiratory":
            headline = "🟢 Low Irritants: Comfortable Breathing"
            summary = f"Particulate matter in {location} is well within safe thresholds. Low risk of respiratory irritation."
        elif sensitivity_group == "outdoor_sports":
            headline = "🟢 Optimal Conditions for Training"
            summary = f"Atmosphere in {location} has minimal PM2.5. Full green light for marathon runs, cycling, and cardio."
        elif sensitivity_group == "outdoor_worker":
            headline = "🟢 Safe Shifts for Outdoor Crews"
            summary = f"Normal outdoor working conditions in {location}. Standard hydration is recommended."
        elif sensitivity_group == "farming_pets":
            headline = "🟢 Good Conditions for Livestock & Pets"
            summary = f"Animals can graze and exercise outdoors safely. Normal agricultural fieldwork can proceed."
        else:
            headline = "🟢 Air Quality is Clean & Fresh"
            summary = f"Air quality in {location} is relatively good. Enjoy your outdoor day without special pollution restrictions."

        dos = [
            {"icon": "🪟", "title": "Ventilate indoor spaces", "desc": "Open windows to bring in clean, fresh ambient air."},
            {"icon": "🏃", "title": "Enjoy outdoor sports", "desc": "Great conditions for jogging, cycling, and park strolls."},
            {"icon": "💧", "title": "Standard hydration", "desc": "Drink water regularly to support natural cellular wellness."}
        ]
        donts = [
            {"icon": "🔥", "title": "Do not burn garbage or leaves", "desc": "Maintain the clean ambient air quality by avoiding open waste burning."},
            {"icon": "🚗", "title": "Avoid excessive vehicle idling", "desc": "Turn off engines when parked to prevent local pocket hotspots."}
        ]

    elif val <= 100:
        level = "MEDIUM"
        color = "#eab308"
        emoji = "🟡"

        if sensitivity_group == "children":
            headline = "🟡 Moderate Air: Monitor School Recess"
            summary = f"Air quality in {location} is moderate. Kids with sensitive airways or coughing history should avoid over-exertion."
        elif sensitivity_group == "elderly":
            headline = "🟡 Moderate Air: Pace Outdoor Activities"
            summary = f"Air quality may cause slight throat tickle for seniors. Consider scheduling leisure walks during breezy midday hours."
        elif sensitivity_group == "respiratory":
            headline = "🟡 Caution: Sensitive Airways May Notice Haze"
            summary = f"PM2.5 is at moderate concentration. Keep quick-relief inhalers nearby and reduce prolonged heavy exertion near roads."
        elif sensitivity_group == "outdoor_sports":
            headline = "🟡 Moderate AQI: Consider Timing Your Workout"
            summary = f"Long endurance sessions (>90 mins) in {location} could lead to mild lung irritation. Prefer parks over arterial roads."
        elif sensitivity_group == "outdoor_worker":
            headline = "🟡 Extended Shifts: Take Rest Breaks"
            summary = f"Outdoor workers in {location} should take periodic indoor breaks and drink water regularly to rinse airway passages."
        elif sensitivity_group == "farming_pets":
            headline = "🟡 Moderate Air: Ensure Fresh Water for Pets"
            summary = f"Keep pet bowls filled with fresh water. Animals with breathing difficulties should rest indoors."
        else:
            headline = "🟡 Air Quality is Moderate"
            summary = f"Air quality in {location} may affect sensitive people during prolonged outdoor activity. General public can proceed normally."

        dos = DEFAULT_DOS
        donts = [
            {"icon": "🏃", "title": "Avoid heavy workouts along traffic arteries", "desc": "Vehicle exhaust compounds with ambient particulate haze."},
            {"icon": "🚭", "title": "Avoid additional indoor smoke", "desc": "Do not smoke indoors or burn incense in poorly ventilated rooms."}
        ]

    else: # HIGH
        level = "HIGH"
        color = "#ef4444"
        emoji = "🔴"

        if sensitivity_group == "children":
            headline = "🔴 High Pollution: Keep Children Indoors"
            summary = f"Elevated pollution detected in {location}. Recess and outdoor sports should be moved indoors immediately."
        elif sensitivity_group == "elderly":
            headline = "🔴 Elevated Health Risk: Stay Indoors"
            summary = f"High AQI poses significant cardiovascular strain for seniors in {location}. Keep windows sealed and use air purifiers."
        elif sensitivity_group == "respiratory":
            headline = "🔴 High Hazard: Strict Caution for Sensitive Airways"
            summary = f"Particulate matter in {location} can trigger acute asthma attacks or bronchospasms. Keep rescue medication ready and wear an N95 mask if outdoors."
        elif sensitivity_group == "outdoor_sports":
            headline = "🔴 Cancel Outdoor Workouts: Move Cardio Indoors"
            summary = f"Breathing heavily in this high AQI ({val}) deposits fine soot deep into lung tissue. Switch to gym treadmill or yoga indoors."
        elif sensitivity_group == "outdoor_worker":
            headline = "🔴 High Exposure Risk: Mandatory N95 Mask"
            summary = f"Construction and traffic staff in {location} must wear protective particulate masks and rotate shifts away from dust/smoke."
        elif sensitivity_group == "farming_pets":
            headline = "🔴 High Hazard for Farm Animals & Pets"
            summary = f"Bring domestic pets indoors. Shelter livestock from dust plumes and check water troughs for soot fallout."
        else:
            headline = "🔴 Elevated Air Pollution in Effect"
            summary = f"Air pollution is high in {location}. Consider reducing prolonged outdoor exposure and monitor local health guidance."

        dos = [
            {"icon": "😷", "title": "Wear N95 / KN95 Respirator", "desc": "A standard cloth mask will not filter PM2.5. Use a certified respirator outdoors."},
            {"icon": "🏠", "title": "Seal windows and run HEPA filter", "desc": "Keep room air clean and recycle AC air on recirculate mode."},
            {"icon": "💧", "title": "Intensive hydration & nasal rinse", "desc": "Flush irritants and hydrate frequently throughout the day."},
            {"icon": "🚨", "title": "Monitor vulnerability symptoms", "desc": "Seek medical attention if experiencing wheezing, chest tightness, or severe irritation."}
        ]
        donts = DEFAULT_DONTS

    # Weather modifiers
    weather_note = ""
    if temp and temp > 35:
        weather_note += " High temperature can amplify ground-level ozone formation."
    if humidity and humidity > 80 and val > 80:
        weather_note += " High humidity trap particulates closer to breathing height as smog."

    if weather_note:
        summary += f" ({weather_note.strip()})"

    return {
        "aqi_level": level,
        "aqi_color": color,
        "aqi_emoji": emoji,
        "sensitivity_group": profile,
        "headline": headline,
        "summary": summary,
        "what_to_do": dos,
        "what_not_to_do": donts,
        "disclaimer": "The system provides general environmental health information and does not diagnose diseases."
    }
