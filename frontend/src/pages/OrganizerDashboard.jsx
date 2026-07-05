import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { CalendarDays, Users, BarChart3, Star, Brain, MessageSquare, ScanLine, FileDown, Eye, AlertCircle, Play } from "lucide-react";
import { analyticsService, eventService, aiService, feedbackService, reportService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";

const COLORS = ["#10B981", "#6B7280", "#EF4444"]; // Positive (green), Neutral (grey), Negative (red)

function OrganizerDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // AI Prediction state
  const [selectedEventForAI, setSelectedEventForAI] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  
  // Feedback Sentiment state
  const [selectedEventForSentiment, setSelectedEventForSentiment] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [loadingSentiment, setLoadingSentiment] = useState(false);

  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  useEffect(() => {
    async function loadOrganizerData() {
      try {
        const s = await analyticsService.getSummary();
        const c = await analyticsService.getCharts();
        const evs = await eventService.list({ organizer_id: user.id });
        setSummary(s);
        setCharts(c);
        setEvents(evs);
      } catch (err) {
        console.error("Error loading organizer dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrganizerData();
  }, [user.id]);

  const runPrediction = async (eventId, eventTitle) => {
    setSelectedEventForAI(eventTitle);
    setPredictionData(null);
    setLoadingPrediction(true);
    try {
      const data = await aiService.getPrediction(eventId);
      setPredictionData(data);
    } catch (err) {
      toast.error("Could not run prediction model. Verify registrations exist.");
    } finally {
      setLoadingPrediction(false);
    }
  };

  const loadSentiments = async (eventId, eventTitle) => {
    setSelectedEventForSentiment(eventTitle);
    setSentimentData(null);
    setLoadingSentiment(true);
    try {
      const data = await feedbackService.getSentiment(eventId);
      setSentimentData(data);
    } catch (err) {
      toast.error("Could not run feedback analysis.");
    } finally {
      setLoadingSentiment(false);
    }
  };

  const handleDownloadReport = async (eventId, format, type) => {
    try {
      let blob;
      if (type === "attendance") {
        blob = await reportService.downloadAttendance(eventId, format);
      } else {
        blob = await reportService.downloadFeedback(eventId, format);
      }
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report_event_${eventId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Report downloaded successfully.");
    } catch (err) {
      toast.error("Error downloading report file.");
    }
  };

  const handleSendReminders = async (eventId) => {
    try {
      const res = await eventService.remind(eventId);
      toast.success(res.message);
    } catch (err) {
      toast.error("Failed to send email reminders.");
    }
  };

  const handleExportAnalytics = async (format) => {
    try {
      const blob = await reportService.downloadAnalytics(format);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard_analytics_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Analytics report downloaded successfully.");
    } catch (err) {
      toast.error("Failed to download analytics report.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Actions bar */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-lg font-bold">Quick Execution Console</h3>
          <p className="text-slate-400 text-xs mt-1">Manage physical scanning check-ins or launch new event forms.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/scan"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <ScanLine size={16} /> Scan QR Ticket
          </Link>
          <Link
            to="/create-event"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            + Create Event
          </Link>
          {/* Export Dashboard Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <FileDown size={16} /> Export Dashboard
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-slate-900 border border-slate-800 rounded-xl py-1 w-32 shadow-xl z-55">
              <button
                onClick={() => handleExportAnalytics("pdf")}
                className="w-full text-left text-[11px] text-slate-300 hover:text-white hover:bg-slate-850 px-3 py-2 cursor-pointer font-medium"
              >
                PDF Format
              </button>
              <button
                onClick={() => handleExportAnalytics("xlsx")}
                className="w-full text-left text-[11px] text-slate-300 hover:text-white hover:bg-slate-850 px-3 py-2 cursor-pointer font-medium"
              >
                Excel Format
              </button>
              <button
                onClick={() => handleExportAnalytics("csv")}
                className="w-full text-left text-[11px] text-slate-300 hover:text-white hover:bg-slate-850 px-3 py-2 cursor-pointer font-medium"
              >
                CSV Format
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300">
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">My Events</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary?.total_events || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300">
          <div className="p-3.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Registrants</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary?.total_registrations || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300">
          <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Average Rating</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary?.average_feedback_rating || 0}/5</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300">
          <div className="p-3.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Check-in Rate</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary?.attendance_rate_pct || 0}%</h3>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Chart 1: Attendance Trends */}
        <div className="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm transition duration-300">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-6 uppercase tracking-wider">Attendance Percentage Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.attendance_trend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} unit="%" />
                <Tooltip />
                <Bar dataKey="attendance_rate" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sentiment pie chart */}
        <div className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm transition duration-300">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-6 uppercase tracking-wider">Overall Sentiment Breakdown</h3>
          <div className="h-64 flex flex-col justify-between">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.feedback_sentiment || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {(charts?.feedback_sentiment || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-500 rounded-full"/>Positive</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-gray-400 rounded-full"/>Neutral</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full"/>Negative</div>
            </div>
          </div>
        </div>
      </div>

      {/* Events tables with AI panels */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        <div className={`${(selectedEventForAI || selectedEventForSentiment) ? "xl:col-span-7" : "xl:col-span-12"} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm transition duration-300`}>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-6 uppercase tracking-wider">My Active Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-650 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3">Title</th>
                  <th className="py-3 text-center font-semibold">Registered</th>
                  <th className="py-3 text-center">AI Prediction</th>
                  <th className="py-3 text-center">Feedbacks</th>
                  <th className="py-3 text-right">Reports & Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((e) => (
                    <tr key={e.id} className="border-b border-slate-50 dark:border-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                      <td className="py-3">
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{e.title}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold">{e.category} | {e.venue}</span>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-700 dark:text-slate-300">{e.participants_count}</td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => runPrediction(e.id, e.title)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-100 dark:hover:bg-blue-900/35 border border-blue-500/10 px-2 py-1 rounded-lg cursor-pointer"
                        >
                          <Brain size={12} /> Forecast
                        </button>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => loadSentiments(e.id, e.title)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-450 hover:bg-purple-100 dark:hover:bg-purple-900/35 border border-purple-500/10 px-2 py-1 rounded-lg cursor-pointer"
                        >
                          <MessageSquare size={12} /> Analyze
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex flex-col sm:flex-row justify-end gap-1.5 items-center">
                          <button
                            onClick={() => handleSendReminders(e.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded border border-blue-200 dark:border-blue-800/80 cursor-pointer text-[10px] font-bold px-1.5 transition"
                            title="Send Email Reminders"
                          >
                            Remind
                          </button>
                          <button
                            onClick={() => handleDownloadReport(e.id, "xlsx", "attendance")}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-800 cursor-pointer text-[10px] font-bold px-1.5 transition"
                          >
                            XLS
                          </button>
                          <button
                            onClick={() => handleDownloadReport(e.id, "pdf", "attendance")}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-800 cursor-pointer text-[10px] font-bold px-1.5 transition"
                          >
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">No active events created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Prediction results display panel */}
        {selectedEventForAI && (
          <div className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6 relative animate-slide-in transition duration-300">
            <button
              onClick={() => setSelectedEventForAI(null)}
              className="absolute top-4 right-4 text-slate-350 hover:text-slate-500 font-bold"
            >
              ×
            </button>
            <div>
              <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/10 uppercase">AI FORECAST MODEL</span>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-2">{selectedEventForAI}</h3>
            </div>
            
            {loadingPrediction ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <LoadingSpinner />
                <span className="text-xs text-slate-400 dark:text-slate-550">Running Random Forest regression...</span>
              </div>
            ) : predictionData ? (
              <div className="space-y-4">
                <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 rounded-2xl text-center space-y-2">
                  <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">PREDICTED ATTENDANCE RATE</span>
                  <h4 className="text-4xl font-black">{Math.round(predictionData.predicted_attendance_rate * 100)}%</h4>
                  <p className="text-xs text-slate-400 font-semibold">
                    Attendees Predicted: {predictionData.predicted_attendance_count}
                  </p>
                </div>
 
                <div className="space-y-3 text-xs text-slate-500 dark:text-slate-450">
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/50 pb-2">
                    <span>Algorithm Used</span>
                    <span className="font-bold text-slate-850 dark:text-slate-300">RandomForestRegressor</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/50 pb-2">
                    <span>Model Confidence Score</span>
                    <span className="font-bold text-green-600 dark:text-green-450">{Math.round(predictionData.confidence_score * 100)}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/50 pb-2">
                    <span>Prediction Context</span>
                    <span className="font-bold text-slate-850 dark:text-slate-300">Weekdays & Time weights</span>
                  </div>
                </div>
 
                <div className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200/50 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-500 rounded-xl flex gap-2 items-start text-[11px] leading-normal font-medium">
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Use this ML prediction to adjust food catering volumes, staff numbers, seating layouts, or print material counts.</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
 
        {/* AI Sentiment results display panel */}
        {selectedEventForSentiment && (
          <div className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6 relative animate-slide-in transition duration-300">
            <button
              onClick={() => setSelectedEventForSentiment(null)}
              className="absolute top-4 right-4 text-slate-350 hover:text-slate-500 font-bold"
            >
              ×
            </button>
            <div>
              <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/10 uppercase">FEEDBACK SENTIMENT</span>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-2">{selectedEventForSentiment}</h3>
            </div>
 
            {loadingSentiment ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <LoadingSpinner />
                <span className="text-xs text-slate-400 dark:text-slate-550">Classifying comments...</span>
              </div>
            ) : sentimentData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200/30 dark:border-green-800/30 p-2.5 rounded-xl">
                    <span className="text-sm text-green-600 dark:text-green-450 font-black">{sentimentData.sentiment_counts.positive}</span>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 font-bold">Positive</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200/30 dark:border-slate-800/30 p-2.5 rounded-xl">
                    <span className="text-sm text-slate-650 dark:text-slate-400 font-black">{sentimentData.sentiment_counts.neutral}</span>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 font-bold">Neutral</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200/30 dark:border-red-800/30 p-2.5 rounded-xl">
                    <span className="text-sm text-red-600 dark:text-red-450 font-black">{sentimentData.sentiment_counts.negative}</span>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 font-bold">Negative</p>
                  </div>
                </div>
 
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Top Review Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sentimentData.keywords.length > 0 ? (
                      sentimentData.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-750">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-450 italic">No keywords extracted.</span>
                    )}
                  </div>
                </div>
 
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actionable AI Recommendations</p>
                  <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {sentimentData.suggestions.map((sug, i) => (
                      <li key={i} className="flex gap-2 items-start bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800">
                        <Star size={14} className="text-amber-500 flex-shrink-0 mt-0.5 fill-amber-500" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}

export default OrganizerDashboard;
