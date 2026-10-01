import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle,
  HelpCircle,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { MonthlyHistory, WeeklyHistory } from '../types/aqi';

interface HistoryRecapProps {
  weekly: WeeklyHistory;
  monthly: MonthlyHistory;
  locationName: string;
}

export const HistoryRecap: React.FC<HistoryRecapProps> = ({
  weekly,
  monthly,
  locationName,
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    aqi: number;
    level: string;
  } | null>(null);

  // SVG dimensions for Weekly Line Chart
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 45;
  const paddingY = 25;

  // Max AQI for scaling
  const maxWeeklyAqi = Math.max(160, weekly.highest_aqi + 20);
  const minWeeklyAqi = 0;

  // Calculate points for weekly line chart
  const weeklyPoints = weekly.chart_data.map((item, idx) => {
    const x =
      paddingX +
      (idx / (weekly.chart_data.length - 1)) * (svgWidth - 2 * paddingX);
    const y =
      svgHeight -
      paddingY -
      ((item.aqi - minWeeklyAqi) / (maxWeeklyAqi - minWeeklyAqi)) *
        (svgHeight - 2 * paddingY);
    return { ...item, x, y };
  });

  const weeklyPathString = weeklyPoints.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    // smooth cubic bezier curve
    const prev = weeklyPoints[idx - 1];
    const cpx1 = prev.x + (pt.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (pt.x - prev.x) / 2;
    const cpy2 = pt.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${pt.x} ${pt.y}`;
  }, '');

  const weeklyAreaString = `${weeklyPathString} L ${
    weeklyPoints[weeklyPoints.length - 1]?.x || 0
  } ${svgHeight - paddingY} L ${weeklyPoints[0]?.x || 0} ${
    svgHeight - paddingY
  } Z`;

  // Calculate points for monthly graph
  const maxMonthlyAqi = Math.max(
    160,
    monthly.highest_pollution_day?.aqi ? monthly.highest_pollution_day.aqi + 20 : 160
  );
  const monthlyPoints = monthly.chart_data.map((item, idx) => {
    const x =
      paddingX +
      (idx / (monthly.chart_data.length - 1)) * (svgWidth - 2 * paddingX);
    const y =
      svgHeight -
      paddingY -
      (item.aqi / maxMonthlyAqi) * (svgHeight - 2 * paddingY);
    return { ...item, x, y };
  });

  const monthlyPathString = monthlyPoints.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    return `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const monthlyAreaString = `${monthlyPathString} L ${
    monthlyPoints[monthlyPoints.length - 1]?.x || 0
  } ${svgHeight - paddingY} L ${monthlyPoints[0]?.x || 0} ${
    svgHeight - paddingY
  } Z`;

  return (
    <section id="history" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                YOUR AIR QUALITY HISTORY
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Historical environmental telemetry and verified trend analysis for {locationName}.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 text-xs font-bold">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'weekly'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly Recap</span>
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'monthly'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Monthly Recap</span>
            </button>
          </div>
        </div>

        {/* Content View: Weekly or Monthly */}
        {activeTab === 'weekly' ? (
          <div className="mt-5 space-y-6">
            {/* Weekly Metrics Banner */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
                THIS WEEK
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 block">Average AQI</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                    {weekly.average_aqi}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                    7-day mean
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                  <span className="text-[11px] font-bold text-emerald-700 block">Lowest AQI</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 block">
                    {weekly.lowest_aqi}
                  </span>
                  <span className="text-[10px] text-emerald-600 mt-0.5 block font-semibold">
                    Best air window
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/70">
                  <span className="text-[11px] font-bold text-rose-700 block">Highest AQI</span>
                  <span className="text-2xl sm:text-3xl font-black text-rose-900 mt-1 block">
                    {weekly.highest_aqi}
                  </span>
                  <span className="text-[10px] text-rose-600 mt-0.5 block font-semibold">
                    Peak pollution
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 block">Avg PM2.5</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                    {weekly.average_pm2_5}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                    µg/m³ ambient
                  </span>
                </div>
              </div>
            </div>

            {/* Level Count Pills (🟢 Low 2 days, 🟡 Medium 4 days, 🔴 High 1 day) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🟢</span>
                  <span className="text-xs font-bold text-emerald-900">Low Days</span>
                </div>
                <span className="text-sm font-black text-emerald-800">
                  {weekly.low_days} {weekly.low_days === 1 ? 'day' : 'days'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🟡</span>
                  <span className="text-xs font-bold text-amber-900">Medium Days</span>
                </div>
                <span className="text-sm font-black text-amber-800">
                  {weekly.medium_days} {weekly.medium_days === 1 ? 'day' : 'days'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔴</span>
                  <span className="text-xs font-bold text-rose-900">High Days</span>
                </div>
                <span className="text-sm font-black text-rose-800">
                  {weekly.high_days} {weekly.high_days === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>

            {/* Weekly Line Chart */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Weekly AQI Changes (7-Day Curve)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Hover over data points to inspect specific daily indices.
                  </p>
                </div>
                {hoveredPoint && (
                  <div className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-xs">
                    {hoveredPoint.label}: <span className="text-emerald-700">{hoveredPoint.aqi} AQI</span> ({hoveredPoint.level})
                  </div>
                )}
              </div>

              {/* Responsive SVG Chart */}
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-44 sm:h-52 overflow-visible"
                >
                  <defs>
                    <linearGradient id="weeklyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Threshold Guideline (50 = Low/Med, 100 = Med/High) */}
                  <line
                    x1={paddingX}
                    y1={svgHeight - paddingY - (50 / maxWeeklyAqi) * (svgHeight - 2 * paddingY)}
                    x2={svgWidth - paddingX}
                    y2={svgHeight - paddingY - (50 / maxWeeklyAqi) * (svgHeight - 2 * paddingY)}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={paddingX}
                    y1={svgHeight - paddingY - (100 / maxWeeklyAqi) * (svgHeight - 2 * paddingY)}
                    x2={svgWidth - paddingX}
                    y2={svgHeight - paddingY - (100 / maxWeeklyAqi) * (svgHeight - 2 * paddingY)}
                    stroke="#fecdd3"
                    strokeDasharray="4 4"
                  />

                  {/* Area Fill */}
                  <path d={weeklyAreaString} fill="url(#weeklyAreaGrad)" />

                  {/* Main Line */}
                  <path
                    d={weeklyPathString}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {weeklyPoints.map((pt, i) => {
                    const color =
                      pt.level === 'LOW'
                        ? '#10b981'
                        : pt.level === 'MEDIUM'
                        ? '#eab308'
                        : '#ef4444';

                    return (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          fill="white"
                          stroke={color}
                          strokeWidth="3"
                          className="cursor-pointer transition-all hover:r-7"
                          onMouseEnter={() =>
                            setHoveredPoint({
                              label: `${pt.day} (${pt.date})`,
                              aqi: pt.aqi,
                              level: pt.level,
                            })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        {/* Day label */}
                        <text
                          x={pt.x}
                          y={svgHeight - 6}
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#64748b"
                        >
                          {pt.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        ) : (
          /* Monthly Recap View */
          <div className="mt-5 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4 rounded-xl border border-emerald-100">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  {monthly.month_label}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900">
                    Average AQI: {monthly.average_aqi}
                  </span>
                </div>
              </div>

              {/* Verified Trend Statement */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-200 shadow-xs">
                {monthly.trend_type === 'improved' ? (
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                ) : monthly.trend_type === 'worsened' ? (
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                ) : (
                  <Minus className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Your Air Quality Trend
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    {monthly.trend_statement}
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Highlight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Highest Pollution Day
                </span>
                <span className="text-xl font-black text-rose-700 mt-1 block">
                  AQI {monthly.highest_pollution_day.aqi}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  Recorded on {monthly.highest_pollution_day.date}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Lowest Pollution Day
                </span>
                <span className="text-xl font-black text-emerald-700 mt-1 block">
                  AQI {monthly.lowest_pollution_day.aqi}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  Recorded on {monthly.lowest_pollution_day.date}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block">
                  High-AQI Days
                </span>
                <span className="text-xl font-black text-slate-900 mt-1 block">
                  {monthly.high_aqi_days} {monthly.high_aqi_days === 1 ? 'day' : 'days'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  Days exceeding AQI 100
                </span>
              </div>
            </div>

            {/* Monthly 30-Day Trend Chart */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-1">
                Monthly Atmospheric Trajectory (30-Day Curve)
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                Continuous pollution tracking stored in SQLite database.
              </p>

              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-44 sm:h-52 overflow-visible"
                >
                  <defs>
                    <linearGradient id="monthlyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path d={monthlyAreaString} fill="url(#monthlyAreaGrad)" />
                  <path
                    d={monthlyPathString}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {monthlyPoints.map((pt, i) => {
                    // Render dots every 4th day to prevent clutter
                    if (i % 4 !== 0 && i !== monthlyPoints.length - 1) return null;
                    return (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="3.5" fill="#0284c7" />
                        <text
                          x={pt.x}
                          y={svgHeight - 6}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#64748b"
                        >
                          {pt.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
