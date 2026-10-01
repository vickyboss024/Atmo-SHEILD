import React, { useState } from 'react';
import { Check, Code2, Copy, Database, FileCode2, Terminal, X } from 'lucide-react';

interface PythonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CODE_FILES: Record<string, { title: string; language: string; content: string }> = {
  'app.py': {
    title: 'app.py (Flask REST API & Jinja Routes)',
    language: 'python',
    content: `from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from database.database import init_db
from services.location_service import get_alphabetical_locations, get_nearby_stations
from services.aqi_service import fetch_live_aqi, classify_aqi_level
from services.weather_service import fetch_live_weather
from services.health_advisory import generate_health_advisory, SENSITIVITY_PROFILES
from services.history_service import get_weekly_recap, get_monthly_recap, record_reading

init_db()
app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

@app.route("/api/aqi", methods=["GET"])
def api_aqi():
    location = request.args.get("location", "Bhubaneswar")
    source_type = request.args.get("source", "api") # 'api' or 'sensor'
    lat = request.args.get("lat", 20.2961, type=float)
    lon = request.args.get("lon", 85.8245, type=float)
    
    aqi_data = fetch_live_aqi(lat, lon, source_type=source_type)
    weather_data = fetch_live_weather(lat, lon)
    return jsonify({"air_quality": aqi_data, "weather": weather_data})

@app.route("/api/advisory", methods=["POST"])
def api_advisory():
    data = request.get_json() or {}
    adv = generate_health_advisory(
        aqi=data.get("aqi"),
        pm2_5=data.get("pm2_5"),
        weather=data.get("weather"),
        location=data.get("location", "Bhubaneswar"),
        sensitivity_group=data.get("sensitivity_group", "general")
    )
    return jsonify({"advisory": adv})`,
  },
  'aqi_service.py': {
    title: 'services/aqi_service.py (Classification & IoT Detector)',
    language: 'python',
    content: `def classify_aqi_level(aqi_value):
    """
    3-Tier Level Classification:
    🟢 LOW (0-50): Air quality is relatively good.
    🟡 MEDIUM (51-100): Air quality may affect sensitive people or prolonged outdoor activity.
    🔴 HIGH (>100): Pollution is elevated and outdoor exposure should be reduced.
    """
    if aqi_value is None:
        return {"level": "UNKNOWN", "emoji": "⚪", "meaning": "Data unavailable."}
    
    val = int(aqi_value)
    if val <= 50:
        return {"level": "LOW", "emoji": "🟢", "meaning": "Air quality is relatively good."}
    elif val <= 100:
        return {"level": "MEDIUM", "emoji": "🟡", "meaning": "Air quality may affect sensitive people or prolonged outdoor activity."}
    else:
        return {"level": "HIGH", "emoji": "🔴", "meaning": "Pollution is elevated and outdoor exposure should be reduced."}`,
  },
  'health_advisory.py': {
    title: 'services/health_advisory.py (Multi-Physiology AI Advisory)',
    language: 'python',
    content: `def generate_health_advisory(aqi, pm2_5=None, weather=None, location="Your Location", sensitivity_group="general"):
    """
    Evaluates 7 Sensitivity Categories:
    1. 👤 General Public
    2. 👶 Children (higher ventilation rate per body mass)
    3. 👵 Elderly (cardiovascular strain defense)
    4. 🫁 Respiratory-sensitive (asthma, COPD bronchospasm prevention)
    5. 🏃 Outdoor/Sports (deep alveolar particulate mitigation)
    6. 👷 Outdoor Worker (occupational exposure & N95 shift rotation)
    7. 🌾 Farming & Pet Animals (trough cleanliness & livestock protection)
    """
    # Generates custom 'What to do', 'What not to do', and diagnostic disclaimer
    ...`,
  },
  'database.py': {
    title: 'database/database.py (SQLite Persistence)',
    language: 'python',
    content: `import sqlite3

def init_db():
    conn = sqlite3.connect("database/aqi_history.db")
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS aqi_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_name TEXT NOT NULL,
        aqi INTEGER NOT NULL,
        pm2_5 REAL, pm10 REAL, co REAL, no2 REAL, so2 REAL, o3 REAL,
        temperature REAL, humidity REAL, wind_speed REAL,
        weather_condition TEXT, aqi_level TEXT NOT NULL,
        source_type TEXT DEFAULT 'api',
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    conn.commit()
    conn.close()`,
  },
};

export const PythonModal: React.FC<PythonModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = CODE_FILES[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-700 shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Python Backend Architecture
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Flask + SQLite3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Modular services for AQI classification, weather feeds, health advisory, and history.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          {Object.keys(CODE_FILES).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setSelectedFile(fileName)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedFile === fileName
                  ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>{fileName}</span>
            </button>
          ))}
        </div>

        {/* Code Editor Window */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs bg-slate-950 text-emerald-300/90 relative">
          <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 mb-2 border-b border-slate-800">
            <span>{currentFile.title}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="whitespace-pre overflow-x-auto leading-relaxed text-slate-200">
            <code>{currentFile.content}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>SQLite database: database/aqi_history.db (Seeded & Functional)</span>
          </div>
          <span className="text-[11px] text-slate-500">Run: python3 app.py</span>
        </div>
      </div>
    </div>
  );
};
