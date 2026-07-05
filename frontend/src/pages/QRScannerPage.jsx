import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import DashboardLayout from "../components/layout/DashboardLayout";
import { attendanceService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScanLine, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

function QRScannerPage() {
  const [scanResult, setScanResult] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [lastCheckInUser, setLastCheckInUser] = useState(null);
  const [manualCode, setManualCode] = useState("");

  useEffect(() => {
    // Initialize html5-qrcode scanner
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText) {
      // Clear scanner on success to prevent looping
      setScanResult(decodedText);
      handleCheckIn(decodedText);
    }

    function onScanError(err) {
      // Debug / quiet error
      // console.warn(err);
    }

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, []);

  const handleCheckIn = async (code) => {
    if (checkingIn) return;
    setCheckingIn(true);
    setLastCheckInUser(null);
    try {
      const res = await attendanceService.checkIn(code);
      toast.success(`Check-In Successful: ${res.participant_name}`);
      setLastCheckInUser(res);
      setScanResult("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Check-in failed. Invalid pass code.");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (!manualCode) {
      toast.warn("Please enter or paste a ticket pass code.");
      return;
    }
    handleCheckIn(manualCode.trim());
    setManualCode("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        <ToastContainer position="top-right" autoClose={4000} />

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <ScanLine className="text-blue-600" /> QR Check-in Terminal
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Scan attendee passes to register check-in times. Duplicate check-ins will be blocked automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Scanner view */}
          <div className="md:col-span-7 bg-white border border-slate-200/85 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase">Camera Viewfinder</span>
              {checkingIn && <span className="text-xs font-semibold text-blue-600 animate-pulse">Verifying code...</span>}
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 flex flex-col justify-center min-h-[300px]">
              <div id="reader" className="w-full"></div>
            </div>

            <p className="text-[10px] text-slate-400 font-semibold text-center mt-2">
              Center the attendee's ticket QR code inside the bounding box to scan.
            </p>
          </div>

          {/* Verification Results Panel */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Manual check in */}
            <div className="bg-white border border-slate-200/85 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-850 text-sm">Manual Code Entry</h3>
              <form onSubmit={handleManualCheckIn} className="space-y-3">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
                  placeholder="Paste eventpilot_pass_... ticket code"
                />
                <button
                  type="submit"
                  disabled={checkingIn}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Verify Ticket Code
                </button>
              </form>
            </div>

            {/* Check-in result */}
            {lastCheckInUser && (
              <div className="bg-green-50 border border-green-200 text-green-900 p-5 rounded-3xl space-y-4 animate-scale-up">
                <div className="flex gap-2 items-center">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="font-bold text-sm">Pass Verified!</span>
                </div>
                
                <div className="text-xs space-y-1.5 font-medium">
                  <p><span className="text-green-700">Participant:</span> {lastCheckInUser.participant_name}</p>
                  <p><span className="text-green-700">Event:</span> {lastCheckInUser.event_title}</p>
                  <p><span className="text-green-700">Check-in:</span> {new Date(lastCheckInUser.check_in_time).toLocaleTimeString()}</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default QRScannerPage;
