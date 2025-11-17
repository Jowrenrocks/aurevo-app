import { useState } from "react";

export default function ViewEventsPage() {
  const [tab, setTab] = useState<"registered" | "upcoming">("registered");

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl mb-6 shadow-lg">
        <h2 className="text-3xl font-bold text-[#3b2a13]">VIEW EVENTS</h2>
      </div>

      {/* Tabs */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setTab("registered")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === "registered" ? "bg-white" : "bg-[#cbb88b]"
            }`}
          >
            Registered List
          </button>
          <button
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === "upcoming" ? "bg-white" : "bg-[#cbb88b]"
            }`}
          >
            Upcoming Events
          </button>
        </div>

        {/* Registered List */}
        {tab === "registered" ? (
          <div className="space-y-4">
            {[
              {
                name: "Angel Stacee Tabligan",
                event: "Birthday Event",
                time: "Just now",
              },
              {
                name: "Nana George",
                event: "Anniversary Event",
                time: "5 days ago",
              },
            ].map((r) => (
              <div
                key={r.name}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <div className="text-xl font-semibold">{r.name}</div>
                  <div className="text-sm italic text-gray-700">
                    Registered for "{r.event}"
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{r.time}</span>
                  <button className="px-3 py-1 bg-green-500 text-white rounded">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Upcoming Events */
          <div className="space-y-4">
            {[
              {
                name: "Angel Stacee Tabligan",
                event: "Birthday Event",
                date: "MAY 7 2026",
              },
              {
                name: "Nana George",
                event: "Anniversary Event",
                date: "MAY 20 2026",
              },
            ].map((u) => (
              <div
                key={u.name}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <div className="text-xl font-semibold">{u.name}</div>
                  <div className="text-sm italic text-gray-700">
                    "{u.event}"
                  </div>
                </div>
                <div className="text-sm text-gray-700">{u.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
