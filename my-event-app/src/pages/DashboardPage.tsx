// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { fetchEvents, rsvp } from "../services/events";
import { initAuth } from "../services/auth";

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep JWT token in headers when page reloads
  useEffect(() => {
    initAuth();
  }, []);

  // Load all events from backend
  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
        setLoading(false);
      });
  }, []);

  // Handle RSVP button click
  const handleRsvp = async (eventId, response) => {
    try {
      await rsvp(eventId, response);
      alert(`RSVP sent: ${response}`);
    } catch (err) {
      console.error(err);
      alert("Error sending RSVP");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">View and RSVP to upcoming events</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  {event.description || "No description available"}
                </p>
                <p className="text-xs text-gray-500">
                  📅 {new Date(event.start_at).toLocaleString()}
                </p>
                {event.location && (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {event.location}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => handleRsvp(event.id, "yes")}
                >
                  Going
                </button>
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  onClick={() => handleRsvp(event.id, "maybe")}
                >
                  Maybe
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleRsvp(event.id, "no")}
                >
                  Not Going
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 text-lg">
            No events available yet.
          </div>
        )}
      </section>
    </div>
  );
}
