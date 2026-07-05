import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { analyticsService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipboardList, ShieldAlert, Clock, Info } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await analyticsService.getActivityLogs();
        setLogs(data);
      } catch (err) {
        toast.error("Error loading activity logs.");
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-blue-600" /> Platform Activity Logs
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Audit logs of all security registrations, check-ins, and modifications.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-3">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm flex items-start gap-4">
                  <div className="p-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg mt-0.5">
                    <Info size={16} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Clock size={10} /> {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{log.details}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Triggered by: {log.user_name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 text-xs">No audit logs found on platform.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Logs;
