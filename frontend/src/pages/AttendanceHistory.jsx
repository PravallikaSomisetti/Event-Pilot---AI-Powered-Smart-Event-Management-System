import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { attendanceService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CalendarDays, CheckCircle2, Clock } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await attendanceService.listMineHistory();
        setHistory(data);
      } catch (err) {
        toast.error("Error loading check-in history.");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="text-green-600" /> Attendance History
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Verify your check-in history for all registered events.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            {history.length > 0 ? (
              <div className="space-y-6 relative border-l border-slate-150 ml-4 pl-6">
                {history.map((h, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Circle timeline dot */}
                    <span className="absolute -left-[31px] top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm" />
                    
                    <h4 className="font-extrabold text-slate-800 text-sm">{h.event_title}</h4>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" /> Checked-in at:{" "}
                      {new Date(h.check_in_time).toLocaleDateString()} {new Date(h.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-slate-400 text-xs">No check-in logs found. Show your QR code pass to organizers on event arrival.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AttendanceHistory;
