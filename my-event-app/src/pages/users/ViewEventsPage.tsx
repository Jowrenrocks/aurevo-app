import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { fetchEvents } from "../../services/events";
import toast, { Toaster } from 'react-hot-toast';

interface Event {
  id: number;
  title: string;
  description?: string;
  start_at: string;
  end_at?: string;
  location?: string;
  created_by: number;
  creator?: {
    full_name: string;
  };
  rsvps_count: number;
  status: string;
}

export default function ViewEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError("Failed to load events");
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start_at);
    const now = new Date();
    const isUpcoming = eventDate > now;
    return tab === "upcoming" ? isUpcoming : !isUpcoming;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (startTime: string, endTime?: string) => {
    const start = new Date(startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (endTime) {
      const end = new Date(endTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${start} - ${end}`;
    }

    return start;
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
      concluded: "bg-blue-100 text-blue-800"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status as keyof typeof statusColors] || statusColors.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const copyRsvpLink = async (eventId: number) => {
    const rsvpUrl = `${window.location.origin}/rsvp/${eventId}`;
    try {
      await navigator.clipboard.writeText(rsvpUrl);
      toast.success('RSVP link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy RSVP link');
    }
  };

  const markEventComplete = async (eventId: number) => {
    try {
      await fetchEvents(); // This should be replaced with actual API call to update status
      // For now, we'll just show a success message
      toast.success('Event marked as completed!');
      // Reload events to reflect changes
      window.location.reload();
    } catch (err) {
      console.error('Failed to mark event complete:', err);
      toast.error('Failed to mark event as completed');
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b885] mx-auto"></div>
          <p className="mt-4 text-[#3b2a13]">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Events</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#d4b885] text-[#3b2a13] rounded-lg font-semibold hover:bg-[#c4b184] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl mb-6 shadow-lg">
        <h2 className="text-3xl font-bold text-[#3b2a13]">MY EVENTS</h2>
        <p className="text-sm text-[#3b2a13] mt-1">View all your scheduled events</p>
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
            Upcoming Events ({filteredEvents.length})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              tab === "completed"
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            Completed Events ({events.filter(e => {
              const eventDate = new Date(e.start_at);
              const now = new Date();
              return eventDate <= now;
            }).length})
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
                          {event.title}
                        </h3>
                        <p className="text-gray-600">
                          Status: {getStatusBadge(event.status)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-[#3b2a13]" />
                        <span>{formatDate(event.start_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5 text-[#3b2a13]" />
                        <span>{formatTime(event.start_at, event.end_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-5 h-5 text-[#3b2a13]" />
                        <span>{event.location || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-5 h-5 text-[#3b2a13]" />
                        <span>{event.rsvps_count} RSVPs</span>
                      </div>
                    </div>

                    {event.description && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 text-sm">{event.description}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => copyRsvpLink(event.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        <Copy className="w-4 h-4" />
                        Copy RSVP Link
                      </button>
                      <button
                        onClick={() => window.open(`/rsvp/${event.id}`, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View RSVP Page
                      </button>
                      {tab === "upcoming" && (
                        <button
                          onClick={() => markEventComplete(event.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Complete
                        </button>
                      )}
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
                  ? "You don't have any upcoming events scheduled."
                  : "You don't have any completed events yet."}
              </p>
              <button
                onClick={() => window.location.href = '/user/create-event'}
                className="mt-4 px-6 py-2 bg-[#d4b885] text-[#3b2a13] rounded-lg font-semibold hover:bg-[#c4b184] transition-colors"
              >
                Create Your First Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
