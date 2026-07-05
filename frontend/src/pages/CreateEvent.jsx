import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { eventService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Tech",
    venue: "",
    date: "",
    time: "",
    capacity: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.venue ||
      !formData.date ||
      !formData.time ||
      !formData.capacity
    ) {
      toast.warn("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Merge date and time into start_date
      const startDateTimeStr = `${formData.date}T${formData.time}`;
      const start_date = new Date(startDateTimeStr);
      
      // Calculate end_date (start_date + 4 hours by default)
      const end_date = new Date(start_date.getTime() + 4 * 60 * 60 * 1000);
      
      // Calculate registration_deadline (start_date - 1 day by default)
      const registration_deadline = new Date(start_date.getTime() - 24 * 60 * 60 * 1000);

      await eventService.create({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        venue: formData.venue,
        capacity: parseInt(formData.capacity),
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
        registration_deadline: registration_deadline.toISOString(),
        banner: null // banner can be uploaded separately
      });

      toast.success("Event created successfully!");
      setTimeout(() => {
        navigate("/events");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not create event. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-800">
          Create New Event
        </h1>

        <p className="text-slate-500 mt-1 mb-8 text-sm font-medium">
          Fill in the specifications below to publish your event.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6 text-slate-700 text-xs font-bold uppercase tracking-wider">
            
            <div className="space-y-2">
              <label>Event Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="AI Dev Hackathon"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              >
                <option value="Tech">Tech</option>
                <option value="Business">Business</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div className="space-y-2">
              <label>Venue / Location</label>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                placeholder="Innovation Lab C"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label>Total Capacity (Participants)</label>
              <input
                type="number"
                name="capacity"
                required
                value={formData.capacity}
                onChange={handleChange}
                placeholder="100"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label>Event Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label>Start Time</label>
              <input
                type="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <label>Description</label>
            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event agenda, schedule, and guest speakers..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold resize-none"
            />
          </div>

          <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/events")}
              className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-xs font-bold text-slate-650 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Publishing..." : "Create & Publish Event"}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}

export default CreateEvent;