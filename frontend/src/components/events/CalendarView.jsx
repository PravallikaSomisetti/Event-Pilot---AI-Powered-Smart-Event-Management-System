import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { eventService } from "../../services/api";
import { toast } from "react-toastify";

const CATEGORY_COLORS = {
  Tech: "bg-blue-600 border-blue-500",
  Business: "bg-green-600 border-green-500",
  Cultural: "bg-purple-600 border-purple-500",
  Sports: "bg-orange-500 border-orange-400",
  Education: "bg-pink-500 border-pink-400"
};

function CalendarView({ events, onRefresh, role }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Drag and Drop implementation
  const handleDragStart = (e, eventId) => {
    if (role === "participant") return;
    e.dataTransfer.setData("text/plain", eventId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, day) => {
    e.preventDefault();
    if (role === "participant") return;
    const eventId = e.dataTransfer.getData("text/plain");
    
    // Find the event
    const event = events.find(ev => ev.id === parseInt(eventId));
    if (!event) return;

    // Calculate new start/end dates
    const oldStartDate = new Date(event.start_date);
    const oldEndDate = new Date(event.end_date);
    const durationMs = oldEndDate.getTime() - oldStartDate.getTime();

    const newStartDate = new Date(year, month, day, oldStartDate.getHours(), oldStartDate.getMinutes());
    const newEndDate = new Date(newStartDate.getTime() + durationMs);

    try {
      await eventService.update(eventId, {
        start_date: newStartDate.toISOString(),
        end_date: newEndDate.toISOString()
      });
      toast.success(`Event '${event.title}' rescheduled to ${newStartDate.toLocaleDateString()}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error("Failed to reschedule event.");
    }
  };

  // Render calendar days
  const calendarCells = [];
  
  // Add empty placeholders for previous month padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="min-h-[100px] border border-slate-100 bg-slate-50/50" />);
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    // Filter events starting on this day
    const dayEvents = events.filter(ev => {
      const d = new Date(ev.start_date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });

    calendarCells.push(
      <div
        key={`day-${day}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, day)}
        className="min-h-[100px] border border-slate-100 p-2 flex flex-col justify-between hover:bg-slate-50/30 transition relative"
      >
        <span className="text-xs font-bold text-slate-400 absolute top-2 right-2">{day}</span>
        
        <div className="flex-1 mt-4 space-y-1 overflow-y-auto max-h-[80px]">
          {dayEvents.map(ev => (
            <div
              key={ev.id}
              draggable={role !== "participant"}
              onDragStart={(e) => handleDragStart(e, ev.id)}
              className={`text-[9px] text-white font-semibold p-1 rounded border shadow-sm cursor-grab active:cursor-grabbing truncate ${
                CATEGORY_COLORS[ev.category] || "bg-indigo-600 border-indigo-500"
              }`}
              title={`${ev.title} (${ev.venue})`}
            >
              {ev.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Calendar Controls */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-150">
        <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <Calendar className="text-blue-600" size={18} /> {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid Header: Days of the week */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase py-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar grid body */}
      <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-2xl overflow-hidden shadow-inner">
        {calendarCells}
      </div>

      {role !== "participant" && (
        <p className="text-[10px] text-slate-400 font-semibold italic text-center">
          * Drag and drop an event pill to reschedule its start date instantly.
        </p>
      )}
    </div>
  );
}

export default CalendarView;
