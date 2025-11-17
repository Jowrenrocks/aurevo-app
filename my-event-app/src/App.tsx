import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
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
import PendingPaymentsPage from "./pages/admin/PendingPaymentsPage";

const queryClient = new QueryClient();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
    }

    // 🔁 Auto-redirect if user refreshes the browser
    if (token && role) {
      if (window.location.pathname === "/" || window.location.pathname === "/login") {
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
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/rsvp" element={<RSVPPage />} />

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
            <Route path="/admin/payments" element={<PendingPaymentsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
