// src/pages/DashboardPage.tsx
import React from "react";
import { motion } from "framer-motion";
import dashboardBg from "../assets/dashboard-bg.png";
import { Calendar, Users, Clock, Archive, Plus } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

/**
 * DashboardPage (cleaned)
 * - Removed the internal sidebar/menu
 * - Fits with your DashboardLayout sidebar
 * - Keeps warm beige/orange-gray theme and stretchable layout
 */

const stats = [
  { id: 1, label: "Total Events", value: 24, Icon: Calendar, accent: "text-yellow-400" },
  { id: 2, label: "Participants", value: 152, Icon: Users, accent: "text-teal-400" },
  { id: 3, label: "Upcoming", value: 5, Icon: Clock, accent: "text-orange-400" },
  { id: 4, label: "Past Events", value: 19, Icon: Archive, accent: "text-purple-400" },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Aurévo Wedding Expo",
    date: "2025-11-05",
    location: "Tagoloan Convention Center",
    attendees: 120,
  },
  {
    id: 2,
    title: "Corporate Year-End Gala",
    date: "2025-12-15",
    location: "SMX Convention",
    attendees: 320,
  },
  {
    id: 3,
    title: "Birthday Bash - Rivera",
    date: "2026-01-08",
    location: "Private Residence",
    attendees: 60,
  },
];

export default function DashboardPage() {
  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      {/* ✅ Main content area only (sidebar removed) */}
      <div className="flex-1 bg-black/25 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header / Intro */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                Your Events Dashboard
              </h1>
              <p className="text-white/90 mt-2 max-w-2xl">
                Overview of your events, attendees, and schedules. Create events,
                track attendees, and manage everything from one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-green-400 text-black"
                onClick={() => (window.location.href = "/create-event")}
              >
                <Plus size={16} />
                Create Event
              </Button>
              <Button variant="outline" className="text-white border-white/60 hover:bg-white/10">
                Export
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((s) => (
              <Card
                key={s.id}
                className="p-6 bg-[#d4a373]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg"
              >
                <CardContent className="flex items-center justify-between gap-4 text-[#3b2e1e]">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-lg bg-[#e5c4a1]/60 flex items-center justify-center ${s.accent}`}
                    >
                      <s.Icon className={`w-6 h-6 ${s.accent}`} />
                    </div>
                    <div>
                      <div className="text-sm">{s.label}</div>
                      <div className="text-2xl font-bold mt-1">{s.value}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#3b2e1e]/80">View</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Upcoming events & activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Events */}
              <Card className="p-6 bg-[#d4a373]/90 border border-white/10 rounded-2xl shadow-lg">
                <CardContent>
                  <div className="flex items-center justify-between mb-4 text-[#3b2e1e]">
                    <h2 className="text-xl font-semibold">Upcoming Events</h2>
                    <p className="text-sm">{upcomingEvents.length} events</p>
                  </div>

                  <div className="space-y-4">
                    {upcomingEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-4 bg-[#e5c4a1]/80 rounded-lg p-4 hover:scale-[1.01] transition"
                      >
                        <div className="w-20 h-20 bg-[#d4a373]/70 rounded-lg flex items-center justify-center text-[#3b2e1e]/80">
                          <div className="text-xs">Image</div>
                        </div>

                        <div className="flex-1 text-[#3b2e1e]">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{ev.title}</h3>
                            <div className="text-sm">{ev.date}</div>
                          </div>
                          <p className="text-sm mt-1">{ev.location}</p>

                          <div className="flex items-center gap-3 mt-3">
                            <div className="text-sm">
                              Attendees: <span className="font-semibold">{ev.attendees}</span>
                            </div>
                            <Button variant="outline" className="text-[#3b2e1e]/80 border-[#3b2e1e]/30">
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6 bg-[#d4a373]/90 border border-white/10 rounded-2xl shadow-lg">
                <CardContent className="text-[#3b2e1e]">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <ul className="space-y-3">
                    <li>✔ Payment received for "Aurévo Wedding Expo" — 120 guests</li>
                    <li>ℹ New RSVP from <strong>Maria Lopez</strong> for "Corporate Gala"</li>
                    <li>⚠ Low stock notice: Decorations for "Birthday Bash"</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Summary */}
            <aside className="space-y-6">
              <Card className="p-4 bg-[#d4a373]/90 border border-white/10 rounded-2xl shadow-lg">
                <CardContent className="text-[#3b2e1e]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm">Next Event</div>
                      <div className="text-lg font-semibold">Aurévo Wedding Expo</div>
                      <div className="text-sm mt-1">Nov 5 · Tagoloan</div>
                    </div>
                    <Calendar size={28} />
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 bg-[#d4a373]/90 border border-white/10 rounded-2xl shadow-lg">
                <CardContent className="text-[#3b2e1e]">
                  <div className="text-sm mb-2">Quick Stats</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#e5c4a1]/80 p-3 rounded">
                      <div className="text-xs">Confirmed</div>
                      <div className="font-bold">98</div>
                    </div>
                    <div className="bg-[#e5c4a1]/80 p-3 rounded">
                      <div className="text-xs">Pending</div>
                      <div className="font-bold">12</div>
                    </div>
                    <div className="bg-[#e5c4a1]/80 p-3 rounded">
                      <div className="text-xs">Income</div>
                      <div className="font-bold">₱124,500</div>
                    </div>
                    <div className="bg-[#e5c4a1]/80 p-3 rounded">
                      <div className="text-xs">Expenses</div>
                      <div className="font-bold">₱24,000</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 bg-[#d4a373]/90 border border-white/10 rounded-2xl shadow-lg">
                <CardContent className="text-[#3b2e1e]">
                  <h4 className="text-sm mb-3">Mini Calendar</h4>
                  <div className="w-full h-40 bg-[#e5c4a1]/80 rounded flex items-center justify-center text-[#3b2e1e]/80">
                    Calendar
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
