import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, Copy, CheckCircle, ExternalLink, Edit, Save, X, Trash2 } from "lucide-react";
import api from "../../utils/api";
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
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    start_at: '',
    end_at: '',
    location: '',
    status: 'pending' as 'draft' | 'pending' | 'approved' | 'declined' | 'concluded'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      setError("Failed to load events");
      console.error("Error loading events:", err);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

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

  const formatDateTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
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

  const startEditing = (event: Event) => {
    setEditingEventId(event.id);
    setEditForm({
      title: event.title,
      description: event.description || '',
      start_at: formatDateTimeForInput(event.start_at),
      end_at: event.end_at ? formatDateTimeForInput(event.end_at) : '',
      location: event.location || '',
      status: event.status as 'draft' | 'pending' | 'approved' | 'declined' | 'concluded'
    });
  };

  const cancelEditing = () => {
    setEditingEventId(null);
    setEditForm({
      title: '',
      description: '',
      start_at: '',
      end_at: '',
      location: '',
      status: 'pending'
    });
  };

  const saveEvent = async (eventId: number) => {
    try {
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        start_at: editForm.start_at,
        end_at: editForm.end_at || null,
        location: editForm.location,
        status: editForm.status
      };

      await api.put(`/events/${eventId}`, updateData);
      toast.success('Event updated successfully!');
      setEditingEventId(null);
      loadEvents(); // Reload events
    } catch (err) {
      console.error('Failed to update event:', err);
      toast.error('Failed to update event');
    }
  };

  const deleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully!');
      loadEvents(); // Reload events
    } catch (err) {
      console.error('Failed to delete event:', err);
      toast.error('Failed to delete event');
    }
  };

  const markEventComplete = async (eventId: number) => {
    try {
      await api.put(`/events/${eventId}`, { status: 'concluded' });
      toast.success('Event marked as completed!');
      loadEvents();
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
            onClick={() => loadEvents()}
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
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl mb-6 shadow-lg">
        <h2 className="text-3xl font-bold text-[#3b2a13]">MY EVENTS</h2>
        <p className="text-sm text-[#3b2a13] mt-1">View and manage all your scheduled events</p>
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
            Upcoming Events ({events.filter(e => new Date(e.start_at) > new Date()).length})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              tab === "completed"
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            Completed Events ({events.filter(e => new Date(e.start_at) <= new Date()).length})
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
                {editingEventId === event.id ? (
                  // EDIT MODE
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time *</label>
                        <input
                          type="datetime-local"
                          value={editForm.start_at}
                          onChange={(e) => setEditForm({...editForm, start_at: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                        <input
                          type="datetime-local"
                          value={editForm.end_at}
                          onChange={(e) => setEditForm({...editForm, end_at: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                        placeholder="Enter event location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Status *</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value as any})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                        required
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                        <option value="concluded">Concluded</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {editForm.status === 'draft' && 'Event is saved but not yet submitted for approval'}
                        {editForm.status === 'pending' && 'Event is awaiting approval'}
                        {editForm.status === 'approved' && 'Event is approved and visible to guests'}
                        {editForm.status === 'declined' && 'Event has been declined'}
                        {editForm.status === 'concluded' && 'Event has been completed'}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => saveEvent(event.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-[#3b2a13] mb-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Status:</span>
                            {getStatusBadge(event.status)}
                          </div>
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
                          <span className="font-semibold">{event.rsvps_count || 0} RSVPs</span>
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
                          onClick={() => startEditing(event)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Event
                        </button>
                        
                        <button
                          onClick={() => copyRsvpLink(event.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
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
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                onClick={() => window.location.href = '/user/events/create'}
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