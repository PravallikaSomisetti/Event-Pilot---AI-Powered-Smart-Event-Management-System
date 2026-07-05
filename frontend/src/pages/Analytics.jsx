import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { analyticsService } from "../services/api";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, Heart, CheckCircle2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";

const COLORS = ["#10B981", "#6B7280", "#EF4444"]; // Positive, Neutral, Negative

function Analytics() {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const c = await analyticsService.getCharts();
        setCharts(c);
      } catch (err) {
        toast.error("Error fetching analytics data.");
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-blue-600" /> Platform Analytics Hub
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Visual insights, timelines, and satisfaction indexes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Registrations Chart */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><TrendingUp size={16} className="text-blue-500" /> Monthly Registration Index</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts?.monthly_registrations || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="registrations" stroke="#3B82F6" strokeWidth={2} fill="#EFF6FF" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Event Attendance Percentages</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.attendance_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip />
                  <Bar dataKey="attendance_rate" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Analysis Chart */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 md:col-span-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><Heart size={16} className="text-red-500" /> Review Sentiment Breakdown</h3>
            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="w-56 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts?.feedback_sentiment || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
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
              <div className="space-y-4 text-xs font-semibold text-slate-500 w-full max-w-sm">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded-full"/>Positive Sentiment</span>
                  <span className="text-slate-850">{(charts?.feedback_sentiment || []).find(s => s.name === "Positive")?.value || 0} reviews</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-gray-400 rounded-full"/>Neutral Sentiment</span>
                  <span className="text-slate-850">{(charts?.feedback_sentiment || []).find(s => s.name === "Neutral")?.value || 0} reviews</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-full"/>Negative Sentiment</span>
                  <span className="text-slate-850">{(charts?.feedback_sentiment || []).find(s => s.name === "Negative")?.value || 0} reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;
