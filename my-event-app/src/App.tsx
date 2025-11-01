// src/App.tsx
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

// User Components & Pages (existing)
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventManagementPage from "./pages/EventManagementPage";
import ProfilePage from "./pages/ProfilePage";
import RSVPPage from "./pages/RSVPPage";

// Admin pages (we will add these files next)
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

          {/* User dashboard layout (existing) */}
          <Route element={<DashboardLayout setIsLoggedIn={setIsLoggedIn} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/events" element={<EventManagementPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin pages (standalone layout) */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/events" element={<ViewEventsPage />} />
          <Route path="/admin/payments" element={<PendingPaymentsPage />} />

          {/* fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
