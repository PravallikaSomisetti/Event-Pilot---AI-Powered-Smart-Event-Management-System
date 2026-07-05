import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { CalendarDays, Users, BarChart3, TrendingUp, Shield, Activity, FileDown } from "lucide-react";
import { analyticsService } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899"];

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const s = await analyticsService.getSummary();
        const c = await analyticsService.getCharts();
        setSummary(s);
        setCharts(c);
      } catch (err) {
        console.error("Error loading admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300">
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Events</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary?.total_events || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300">
          <div className="p-3.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Participants</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary?.total_participants || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300">
          <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Organizers</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary?.total_organizers || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition duration-300">
          <div className="p-3.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{summary?.attendance_rate_pct || 0}%</h3>
          </div>
        </div>
      </div>

      {/* Grid for main analytics charts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Chart 1: Registrations trend */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm transition duration-300">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-6 uppercase tracking-wider">Monthly Registration Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthly_registrations || []}>
                <defs>
                  <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="registrations" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRegs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category distribution */}
        <div className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm transition duration-300">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-6 uppercase tracking-wider">Event Categories</h3>
          <div className="h-72 flex flex-col justify-between">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.category_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(charts?.category_distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Category legends */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {(charts?.category_distribution || []).slice(0, 4).map((c, i) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="truncate">{c.name} ({c.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Bottom Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Table 1: Popular Events */}
        <div className="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm transition duration-300">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-6 uppercase tracking-wider">Most Popular Events</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-650 dark:text-slate-350">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3">Event Name</th>
                  <th className="py-3 text-center">Registrations</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {(charts?.event_popularity || []).map((e, idx) => (
                  <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{e.name}</td>
                    <td className="py-3 text-center font-bold text-slate-700 dark:text-slate-300">{e.registrations}</td>
                    <td className="py-3 text-right">
                      <span className="bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/10">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Recent Signups */}
        <div className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm transition duration-300">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-6 uppercase tracking-wider">Recent Registrations</h3>
          <div className="space-y-4">
            {(summary?.recent_registrations || []).map((r, idx) => (
              <div key={idx} className="flex justify-between items-center p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 border border-slate-100 dark:border-slate-850 rounded-xl transition">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{r.participant_name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{r.event_title}</p>
                </div>
                <span className="text-[9px] text-slate-450 dark:text-slate-500 font-medium">
                  {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
