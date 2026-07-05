import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminDashboard from "./AdminDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import ParticipantDashboard from "./ParticipantDashboard";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("eventpilot_token");
    
    if (!loggedIn || !token) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(loggedIn));
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  // Choose sub-dashboard based on role
  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "organizer":
        return <OrganizerDashboard />;
      case "participant":
      default:
        return <ParticipantDashboard />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {renderDashboard()}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;