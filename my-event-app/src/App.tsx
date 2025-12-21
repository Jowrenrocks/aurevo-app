import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "./components/ui/tooltip";
import ProtectedRoute from "./components/ProtectedRoute";
import { initAuth } from "./services/auth";

// Public pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import RSVPPage from "./pages/RSVPPage";

// User pages + layout
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/users/DashboardPage";
import CreateEventPage from "./pages/users/CreateEventPage";
import EventManagementPage from "./pages/users/EventManagementPage";
import ViewEventsPage from "./pages/users/ViewEventsPage";
import ProfilePage from "./pages/users/ProfilePage";
import UserRSVPPage from "./pages/users/UserRSVPPage";
import EditEventPage from "./pages/users/EditEventPage";
import HelpPage from "./pages/users/HelpPage";

// Admin pages + layout
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminViewEventsPage from "./pages/admin/ViewEventsPage";
import AdminCreateEventPage from "./pages/admin/CreateEventPage";
import AdminEditEventPage from "./pages/admin/EditEventPage";
import AdminRSVPPage from "./pages/admin/RSVPPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      initAuth(); // ✅ Initialize auth token on app start
      setIsLoggedIn(true);
    }

    if (token && role) {
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/login"
      ) {
        if (role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-right" />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/rsvp/:eventId" element={<RSVPPage />} />

          {/* User Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="user">
                <DashboardLayout setIsLoggedIn={setIsLoggedIn} />
              </ProtectedRoute>
            }
          >
            <Route path="/user/dashboard" element={<DashboardPage />} />
            <Route path="/user/create-event" element={<CreateEventPage />} />
            <Route path="/user/events" element={<EventManagementPage />} />
            <Route path="/user/view-events" element={<ViewEventsPage />} />
            <Route path="/user/edit-event/:eventId" element={<EditEventPage />} />
            <Route path="/user/rsvps" element={<UserRSVPPage />} />
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/help" element={<HelpPage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout setIsLoggedIn={setIsLoggedIn} />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/events" element={<AdminViewEventsPage />} />
            <Route path="/admin/create-event" element={<AdminCreateEventPage />} />
            <Route path="/admin/edit-event/:eventId" element={<AdminEditEventPage />} />
            <Route path="/admin/rsvps" element={<AdminRSVPPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;