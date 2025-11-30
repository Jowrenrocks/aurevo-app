import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "./components/ui/tooltip";
import ProtectedRoute from "./components/ProtectedRoute";

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
import ProfilePage from "./pages/users/ProfilePage";

// Admin pages + layout
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import ViewEventsPage from "./pages/admin/ViewEventsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import AdminRSVPPage from "./pages/admin/RSVPPage";

const queryClient = new QueryClient();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
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

        {/* ✅ Added EXACTLY as you requested */}
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
            <Route path="/user/profile" element={<ProfilePage />} />
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
            <Route path="/admin/events" element={<ViewEventsPage />} />
            <Route path="/admin/rsvps" element={<AdminRSVPPage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
