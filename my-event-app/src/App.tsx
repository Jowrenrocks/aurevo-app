// src/App.tsx
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

// User Components & Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import DashboardLayout from "./components/DashboardLayout"; // shared layout
import DashboardPage from "./pages/users/DashboardPage";
import CreateEventPage from "./pages/users/CreateEventPage";
import EventManagementPage from "./pages/users/EventManagementPage";
import ProfilePage from "./pages/users/ProfilePage";
import RSVPPage from "./pages/RSVPPage";

// Admin pages
import AdminDashboardPage from "./pages/admin/DashboardPage";
import ViewEventsPage from "./pages/admin/ViewEventsPage";
import PendingPaymentsPage from "./pages/admin/PendingPaymentsPage";

const queryClient = new QueryClient();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/rsvp" element={<RSVPPage />} />

          {/* Shared Dashboard Layout for both user and admin */}
          <Route element={<DashboardLayout setIsLoggedIn={setIsLoggedIn} />}>
            {/* User pages */}
            <Route path="/user/dashboard" element={<DashboardPage />} />
            <Route path="/user/create-event" element={<CreateEventPage />} />
            <Route path="/user/events" element={<EventManagementPage />} />
            <Route path="/user/profile" element={<ProfilePage />} />

            {/* Admin pages */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/events" element={<ViewEventsPage />} />
            <Route path="/admin/payments" element={<PendingPaymentsPage />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
