import React, { useState } from "react";
import { motion } from "framer-motion";
import dashboardBg from "../assets/dashboard-bg.png";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CalendarDays, Edit3, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  venue: string;
  status: "Pending" | "Approved" | "Declined";
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, title: "Aurévo Wedding Expo", date: "2025-11-05", venue: "Tagoloan Convention Center", status: "Approved" },
    { id: 2, title: "Corporate Gala Night", date: "2025-12-12", venue: "SMX Convention", status: "Pending" },
    { id: 3, title: "Birthday Bash - Rivera", date: "2026-01-08", venue: "Private Residence", status: "Declined" },
  ]);

  const handleStatusChange = (id: number, newStatus: "Approved" | "Declined") => {
    setEvents(events.map((ev) => (ev.id === id ? { ...ev, status: newStatus } : ev)));
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <div className="flex-1 bg-black/40 backdrop-blur-sm min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif font-bold text-[#f8f4ef] mb-8 drop-shadow-md"
          >
            Event Management
          </motion.h1>

          {/* Table/Card List */}
          <Card className="bg-[#f1dfc6]/90 border border-[#c8b08b]/50 rounded-2xl shadow-xl backdrop-blur-md">
            <CardContent className="p-6 overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-[#d4b68a]/80 text-[#2e2e2e] uppercase text-xs font-semibold tracking-wide">
                    <th className="py-3 px-4 rounded-tl-lg">Event Title</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-[#d3bfa5]/40 hover:bg-[#f7ecd9]/80 transition text-[#3b2e1e]"
                    >
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        <CalendarDays size={16} className="text-[#a67c52]" />
                        {event.title}
                      </td>
                      <td className="py-3 px-4">{event.date}</td>
                      <td className="py-3 px-4">{event.venue}</td>
                      <td className="py-3 px-4 font-semibold">
                        {event.status === "Approved" && (
                          <span className="text-green-800 bg-green-200/90 px-3 py-1 rounded-full text-xs shadow-sm">
                            Approved
                          </span>
                        )}
                        {event.status === "Pending" && (
                          <span className="text-yellow-800 bg-yellow-200/90 px-3 py-1 rounded-full text-xs shadow-sm">
                            Pending
                          </span>
                        )}
                        {event.status === "Declined" && (
                          <span className="text-red-800 bg-red-200/90 px-3 py-1 rounded-full text-xs shadow-sm">
                            Declined
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center flex justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-700 border-blue-400 hover:bg-blue-50 hover:text-blue-900 transition"
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-700 border-green-400 hover:bg-green-50 hover:text-green-900 transition"
                          onClick={() => handleStatusChange(event.id, "Approved")}
                        >
                          <CheckCircle size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-700 border-red-400 hover:bg-red-50 hover:text-red-900 transition"
                          onClick={() => handleStatusChange(event.id, "Declined")}
                        >
                          <XCircle size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-700 border-gray-400 hover:bg-gray-50 hover:text-gray-900 transition"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
