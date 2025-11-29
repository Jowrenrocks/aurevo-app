import { useState } from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface Event {
  id: number;
  name: string;
  organizer: string;
  eventType: string;
  date: string;
  time: string;
  venue: string;
  guests: number;
  status: "upcoming" | "completed";
}

const mockEvents: Event[] = [
  {
    id: 1,
    name: "Birthday Event",
    organizer: "Angel Stacee Tabligan",
    eventType: "Birthday",
    date: "May 7, 2026",
    time: "6:00 PM - 10:00 PM",
    venue: "Grand Ballroom",
    guests: 100,
    status: "upcoming"
  },
  {
    id: 2,
    name: "Anniversary Event",
    organizer: "Nana George",
    eventType: "Anniversary",
    date: "May 20, 2026",
    time: "5:00 PM - 9:00 PM",
    venue: "Garden Pavilion",
    guests: 75,
    status: "upcoming"
  },
  {
    id: 3,
    name: "Corporate Gala",
    organizer: "John Smith",
    eventType: "Corporate",
    date: "March 15, 2025",
    time: "7:00 PM - 11:00 PM",
    venue: "Convention Center",
    guests: 250,
    status: "completed"
  },
  {
    id: 4,
    name: "Wedding Reception",
    organizer: "Maria Garcia",
    eventType: "Wedding",
    date: "April 10, 2025",
    time: "4:00 PM - 10:00 PM",
    venue: "Luxury Garden Resort",
    guests: 150,
    status: "completed"
  }
];

export default function ViewEventsPage() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  const filteredEvents = mockEvents.filter(event => event.status === tab);

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl mb-6 shadow-lg">
        <h2 className="text-3xl font-bold text-[#3b2a13]">VIEW EVENTS</h2>
        <p className="text-sm text-[#3b2a13] mt-1">Browse all scheduled events</p>
      </div>

      {/* Tabs */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              tab === "upcoming" 
                ? "bg-white text-[#3b2a13] shadow-md" 
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            Upcoming Events ({mockEvents.filter(e => e.status === "upcoming").length})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              tab === "completed" 
                ? "bg-white text-[#3b2a13] shadow-md" 
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            Completed Events ({mockEvents.filter(e => e.status === "completed").length})
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-[#3b2a13] mb-1">
                          {event.name}
                        </h3>
                        <p className="text-gray-600">
                          Organized by <span className="font-semibold">{event.organizer}</span>
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                        {event.eventType}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-[#3b2a13]" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5 text-[#3b2a13]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-5 h-5 text-[#3b2a13]" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-5 h-5 text-[#3b2a13]" />
                        <span>{event.guests} guests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-xl text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No {tab} events
              </h3>
              <p className="text-gray-500">
                {tab === "upcoming" 
                  ? "There are no upcoming events scheduled at the moment." 
                  : "No events have been completed yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}