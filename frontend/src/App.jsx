import { Routes, Route } from "react-router-dom";
import React from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import QRScannerPage from "./pages/QRScannerPage";
import Users from "./pages/Users";
import Logs from "./pages/Logs";
import AttendanceHistory from "./pages/AttendanceHistory";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/events" 
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-event" 
        element={
          <ProtectedRoute allowedRoles={["organizer", "admin"]}>
            <CreateEvent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/scan" 
        element={
          <ProtectedRoute allowedRoles={["organizer", "admin"]}>
            <QRScannerPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Users />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/logs" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Logs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/attendance-history" 
        element={
          <ProtectedRoute allowedRoles={["participant", "admin"]}>
            <AttendanceHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute allowedRoles={["organizer", "admin"]}>
            <Analytics />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;