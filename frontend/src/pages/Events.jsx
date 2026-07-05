import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import CalendarView from "../components/events/CalendarView";
import { eventService, registrationService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Calendar, Table, Check, Trash2, CalendarDays, Upload, AlertCircle, Ban } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

function Events() {
  const [events, setEvents] = useState([]);
  const [userRegEventIds, setUserRegEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'calendar'

  // Filters state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");

  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Load events
      const filters = { search, category, venue };
      // Organizers should only manage their own events under table view if they choose,
      // but let's query all events and let them see the whole platform while keeping their own items editable!
      const data = await eventService.list(filters);
      setEvents(data);

      // If participant, load registrations to know which ones they already registered for
      if (user.role === "participant") {
        const regs = await registrationService.listMine();
        const registeredIds = new Set(regs.map(r => r.event_id));
        setUserRegEventIds(registeredIds);
      }
    } catch (err) {
      toast.error("Could not fetch events from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [category]); // reload on category change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEvents();
  };

  const handleRegister = async (eventId, title) => {
    try {
      await registrationService.register(eventId);
      toast.success(`Registered successfully for ${title}!`);
      // Update registration state
      setUserRegEventIds(prev => new Set([...prev, eventId]));
      // Reload events to update participant count
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed.");
    }
  };

  const handleCancel = async (eventId) => {
    try {
      await eventService.cancel(eventId);
      toast.warn("Event cancelled.");
      loadEvents();
    } catch (err) {
      toast.error("Error cancelling event.");
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventService.delete(eventId);
      toast.error("Event deleted.");
      loadEvents();
    } catch (err) {
      toast.error("Error deleting event.");
    }
  };

  const handleBannerUpload = async (eventId, file) => {
    if (!file) return;
    try {
      await eventService.uploadBanner(eventId, file);
      toast.success("Event banner uploaded successfully.");
      loadEvents();
    } catch (err) {
      toast.error("Error uploading banner.");
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="space-y-8 animate-fade-in">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Event Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Explore scheduled events, manage registrations, or check schedules.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-white border border-slate-200 rounded-xl p-1 flex gap-1 shadow-sm">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg cursor-pointer transition ${viewMode === "table" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                title="Table List View"
              >
                <Table size={16} />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-2 rounded-lg cursor-pointer transition ${viewMode === "calendar" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                title="Calendar Board View"
              >
                <Calendar size={16} />
              </button>
            </div>
            
            {/* Add Event Button for Admin/Organizer */}
            {user.role !== "participant" && (
              <Link
                to="/create-event"
                className="bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
              >
                + New Event
              </Link>
            )}
          </div>
        </div>

        {/* Filters and search header bar */}
        <form onSubmit={handleSearchSubmit} className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-full sm:w-64 focus-within:border-blue-500 transition">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by title..."
                className="bg-transparent outline-none px-3 text-xs w-full text-slate-600 placeholder-slate-400"
              />
            </div>
            
            {/* Location Filter */}
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Filter by venue..."
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-600 focus:outline-none focus:border-blue-500 w-full sm:w-44"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Category selection */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-600 focus:outline-none focus:border-blue-500 w-full md:w-36 font-semibold"
            >
              <option value="">All Categories</option>
              <option value="Tech">Tech</option>
              <option value="Business">Business</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Education">Education</option>
            </select>

            <button
              type="submit"
              className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Dynamic Display Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : viewMode === "calendar" ? (
          <CalendarView events={events} onRefresh={loadEvents} role={user.role} />
        ) : (
          /* Table list view */
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-550 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Event Details</th>
                    <th className="py-4">Dates & Venue</th>
                    <th className="py-4 text-center">Registered</th>
                    <th className="py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length > 0 ? (
                    events.map((e) => {
                      const isRegistered = userRegEventIds.has(e.id);
                      const isOwner = e.organizer_id === user.id || user.role === "admin";
                      return (
                        <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                          <td className="px-6 py-4 flex gap-4 items-center">
                            {/* Banner display or default icon */}
                            {e.banner ? (
                              <img
                                src={`http://localhost:8000${e.banner}`}
                                alt="Banner"
                                className="w-14 h-10 object-cover rounded-lg border border-slate-150"
                              />
                            ) : (
                              <div className="w-14 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                                <CalendarDays size={18} />
                              </div>
                            )}
                            <div>
                              <p className="font-extrabold text-slate-800 text-xs">{e.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{e.category}</p>
                            </div>
                          </td>
                          <td className="py-4 text-xs font-semibold text-slate-500">
                            <p>{new Date(e.start_date).toLocaleDateString()} at {new Date(e.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{e.venue}</p>
                          </td>
                          <td className="py-4 text-center font-black text-slate-700">{e.participants_count} / {e.capacity}</td>
                          <td className="py-4 text-center">
                            {e.is_cancelled ? (
                              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/10 inline-flex items-center gap-1"><Ban size={10} /> Cancelled</span>
                            ) : new Date(e.start_date) < new Date() ? (
                              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 inline-flex items-center gap-1">Completed</span>
                            ) : (
                              <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/10 inline-flex items-center gap-1"><Check size={10} /> Active</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-y-1">
                            {/* Action depending on user role */}
                            {user.role === "participant" ? (
                              <button
                                disabled={isRegistered || e.is_cancelled || e.participants_count >= e.capacity}
                                onClick={() => handleRegister(e.id, e.title)}
                                className={`text-xs font-bold px-4 py-1.5 rounded-xl transition cursor-pointer ${
                                  isRegistered
                                    ? "bg-slate-100 text-slate-400 border border-slate-200"
                                    : e.is_cancelled
                                    ? "bg-slate-50 text-slate-350 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-750 text-white shadow-md shadow-blue-500/10"
                                }`}
                              >
                                {isRegistered ? "Registered" : e.is_cancelled ? "Cancelled" : "Register"}
                              </button>
                            ) : (
                              /* Admin & Organizer Actions */
                              <div className="flex justify-end gap-2 items-center">
                                {/* Upload banner button */}
                                {isOwner && (
                                  <label className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-lg cursor-pointer transition">
                                    <Upload size={13} />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(evt) => handleBannerUpload(e.id, evt.target.files[0])}
                                    />
                                  </label>
                                )}
                                
                                {isOwner && !e.is_cancelled && (
                                  <button
                                    onClick={() => handleCancel(e.id)}
                                    className="p-2 border border-slate-200 hover:bg-slate-50 text-amber-600 rounded-lg cursor-pointer transition"
                                    title="Cancel Event"
                                  >
                                    <Ban size={13} />
                                  </button>
                                )}

                                {isOwner && (
                                  <button
                                    onClick={() => handleDelete(e.id)}
                                    className="p-2 border border-red-200/30 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer transition"
                                    title="Delete Event"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 text-xs font-semibold">
                        No events found matching current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Events;