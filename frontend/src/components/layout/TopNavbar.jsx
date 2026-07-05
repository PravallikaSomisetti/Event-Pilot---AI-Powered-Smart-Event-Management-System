import React, { useState, useEffect } from "react";
import { Bell, Search, UserCircle, CheckCircle, Calendar, MessageSquare, AlertCircle, Sun, Moon } from "lucide-react";
import { authService } from "../../services/api";

function TopNavbar() {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "registration",
      text: "Sam Participant registered for AI Hackathon 2026",
      time: "2 mins ago",
      icon: <CheckCircle className="text-green-500" size={16} />
    },
    {
      id: 2,
      type: "event",
      text: "Upcoming event: Vite & React Dev Summit starts in 2 hours",
      time: "1 hour ago",
      icon: <Calendar className="text-blue-500" size={16} />
    },
    {
      id: 3,
      type: "feedback",
      text: "New Feedback submitted for SaaS Founders Meetup",
      time: "3 hours ago",
      icon: <MessageSquare className="text-purple-500" size={16} />
    }
  ]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInUser");
    if (loggedIn) {
      setUser(JSON.parse(loggedIn));
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <header className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-6 py-4 mb-8 flex items-center justify-between shadow-sm relative z-20 transition duration-300">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">
          Welcome back, {user?.name || "User"}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
          Role: <span className="capitalize text-blue-600 dark:text-blue-400 font-bold">{user?.role || "Participant"}</span>
        </p>
      </div>

      {/* Options */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden sm:flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 w-64 focus-within:border-blue-500 transition duration-300">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Global search..."
            className="bg-transparent outline-none px-3 text-xs w-full text-slate-650 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600"
          />
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/50 cursor-pointer transition"
          title="Toggle Dark Mode"
        >
          {theme === "dark" ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-600" />}
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/50 cursor-pointer transition"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1.5 bg-red-500 text-white text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold text-slate-850 dark:text-slate-100 text-sm">Notifications</span>
                <span className="text-[10px] text-blue-500 font-semibold cursor-pointer" onClick={() => setNotifications([])}>Clear all</span>
              </div>
              
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 items-start p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition">
                      <div className="mt-0.5">{n.icon}</div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs text-slate-700 dark:text-slate-350 leading-tight font-semibold">{n.text}</p>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">{n.time}</span>
                      </div>
                      <button 
                        onClick={() => clearNotification(n.id)}
                        className="text-slate-300 dark:text-slate-600 hover:text-slate-500 text-xs font-bold px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-450 dark:text-slate-500 text-center py-4">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-850">
          {user?.avatar_url ? (
            <img 
              src={`http://localhost:8000${user.avatar_url}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
            />
          ) : (
            <UserCircle size={38} className="text-slate-300 dark:text-slate-700" />
          )}
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">{user?.organization || "EventPilot Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;;