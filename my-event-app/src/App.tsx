import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

// Components & Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventManagementPage from "./pages/EventManagementPage";
import ProfilePage from "./pages/ProfilePage";

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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard Layout */}
          <Route element={<DashboardLayout setIsLoggedIn={setIsLoggedIn} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/events" element={<EventManagementPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
