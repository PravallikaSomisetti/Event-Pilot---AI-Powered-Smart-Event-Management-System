import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Brain,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ScanLine,
  ShieldAlert,
  ClipboardList
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/api";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || { role: "participant" };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Get menu items based on role
  const getMenuItems = () => {
    const common = [
      {
        icon: <User size={20} />,
        title: "My Profile",
        path: "/profile",
      },
    ];

    if (user.role === "admin") {
      return [
        {
          icon: <LayoutDashboard size={20} />,
          title: "Admin Overview",
          path: "/dashboard",
        },
        {
          icon: <Users size={20} />,
          title: "Manage Users",
          path: "/users",
        },
        {
          icon: <CalendarDays size={20} />,
          title: "Manage Events",
          path: "/events",
        },
        {
          icon: <ClipboardList size={20} />,
          title: "Activity Logs",
          path: "/logs",
        },
        ...common
      ];
    } else if (user.role === "organizer") {
      return [
        {
          icon: <LayoutDashboard size={20} />,
          title: "Organizer Panel",
          path: "/dashboard",
        },
        {
          icon: <CalendarDays size={20} />,
          title: "My Events",
          path: "/events",
        },
        {
          icon: <ScanLine size={20} />,
          title: "QR Check-in Scanner",
          path: "/scan",
        },
        {
          icon: <BarChart3 size={20} />,
          title: "Analytics Hub",
          path: "/analytics",
        },
        ...common
      ];
    } else {
      // Participant
      return [
        {
          icon: <CalendarDays size={20} />,
          title: "Explore Events",
          path: "/events",
        },
        {
          icon: <LayoutDashboard size={20} />,
          title: "My Dashboard",
          path: "/dashboard",
        },
        {
          icon: <ClipboardList size={20} />,
          title: "Check-in History",
          path: "/attendance-history",
        },
        ...common
      ];
    }
  };

  const menu = getMenuItems();

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 z-30">
      <div className="text-2xl font-black text-center py-6 border-b border-slate-850 tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-1.5">
        EventPilot <span className="text-[10px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded-md border border-blue-500/20">{user.role.toUpperCase()}</span>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition text-sm font-semibold ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-850">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-750 hover:border-red-900/30 transition text-sm font-semibold cursor-pointer"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;