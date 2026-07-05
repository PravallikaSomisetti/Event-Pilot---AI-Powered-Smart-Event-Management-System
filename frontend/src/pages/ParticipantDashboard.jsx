import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { registrationService, feedbackService, attendanceService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CalendarDays, Star, MessageSquare, Ticket, Clock, CheckCircle } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

function ParticipantDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // QR Pass modal state
  const [activeQRReg, setActiveQRReg] = useState(null);
  
  // Feedback submission state
  const [feedbackEventId, setFeedbackEventId] = useState(null);
  const [feedbackEventTitle, setFeedbackEventTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const regs = await registrationService.listMine();
        const hist = await attendanceService.listMineHistory();
        setRegistrations(regs);
        setHistory(hist);
      } catch (err) {
        console.error("Error loading participant dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warn("Please write a comment.");
      return;
    }
    setSubmittingFeedback(true);
    try {
      await feedbackService.submit(feedbackEventId, { rating, comment });
      toast.success("Feedback submitted! Sentiment analysis completed.");
      setFeedbackEventId(null);
      setComment("");
      setRating(5);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Feedback submission error.");
    } finally {
      setSubmittingFeedback(false);
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Registered Events */}
        <div className="xl:col-span-8 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">My Event Passes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <div key={reg.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition">
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-500/10 uppercase">
                        Registered Ticket
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm mt-2">{reg.event_title}</h4>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-t border-slate-100 pt-3">
                      <span className={reg.checked_in ? "text-green-600" : "text-amber-500"}>
                        Status: {reg.checked_in ? "Checked In" : "Not Check In"}
                      </span>
                      <span>Pass: #{reg.id}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2">
                    <button
                      onClick={() => setActiveQRReg(reg)}
                      className="w-1/2 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-750 text-white text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
                    >
                      <Ticket size={14} /> Get Pass
                    </button>
                    <button
                      onClick={() => {
                        setFeedbackEventId(reg.event_id);
                        setFeedbackEventTitle(reg.event_title);
                      }}
                      className="w-1/2 flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
                    >
                      <MessageSquare size={14} /> Feedback
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center py-10 text-slate-400 text-xs">
                You haven't registered for any events yet. Check the Explore tab!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Attendance Check-in Timeline */}
        <div className="xl:col-span-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Attendance Logs</h3>
          
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((h, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="p-1.5 bg-green-50 text-green-600 rounded-full border border-green-200/10">
                    <CheckCircle size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{h.event_title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Checked-in at {new Date(h.check_in_time).toLocaleDateString()} {new Date(h.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-400 text-xs">No check-in history found.</p>
            )}
          </div>
        </div>

      </div>

      {/* QR Ticket Modal Dialog */}
      {activeQRReg && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full text-center space-y-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setActiveQRReg(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
            >
              ×
            </button>
            
            <div>
              <h3 className="font-bold text-slate-800 text-base">Your Event Pass</h3>
              <p className="text-slate-400 text-xs mt-1 truncate">{activeQRReg.event_title}</p>
            </div>
            
            <div className="flex justify-center border border-slate-100 p-4 rounded-2xl bg-slate-50">
              <QRCode value={activeQRReg.qr_code} size={180} />
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium">
              Show this QR code to the event organizer at the entrance gate to check in.
            </p>
            
            <button
              onClick={() => {
                // Mock ticket printing
                window.print();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Download PDF / Print Ticket
            </button>
          </div>
        </div>
      )}

      {/* Feedback Submission Dialog */}
      {feedbackEventId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setFeedbackEventId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
            >
              ×
            </button>
            
            <div>
              <span className="text-[9px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-500/10 uppercase">
                Feedback & Review
              </span>
              <h3 className="font-bold text-slate-800 text-base mt-2">{feedbackEventTitle}</h3>
              <p className="text-slate-400 text-xs mt-1">Submit your rating and comments. AI sentiment will process them instantly.</p>
            </div>
            
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Event Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition cursor-pointer ${star <= rating ? "text-amber-500 font-bold" : "text-slate-350"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Comments</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the event? What did you enjoy? What could be improved?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFeedbackEventId(null)}
                  className="w-1/2 border border-slate-300 text-slate-650 font-semibold py-2.5 rounded-xl text-xs transition hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-1/2 bg-blue-600 hover:bg-blue-750 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  {submittingFeedback ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ParticipantDashboard;
