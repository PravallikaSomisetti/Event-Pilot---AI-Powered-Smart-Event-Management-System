import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("eventpilot_token");
  const loggedIn = localStorage.getItem("loggedInUser");

  if (!token || !loggedIn) {
    // Clear any partial/stale state
    localStorage.removeItem("eventpilot_token");
    localStorage.removeItem("loggedInUser");
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(loggedIn);

  // If role checking is required and user's role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
