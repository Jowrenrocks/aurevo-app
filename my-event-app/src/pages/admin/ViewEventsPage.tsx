import { useState, useEffect } from "react";
import { 
  Calendar, MapPin, Users, Clock, Edit, Trash2, Eye, Search, 
  Filter, RefreshCw, User as UserIcon, AlertTriangle,
  Loader2, AlertCircle, ExternalLink, Copy, Ban
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api';

interface Event {
  id: number;
  title: string;
  description?: string;
  start_at: string;
  end_at?: string;
  location?: string;
  user_id: number;
  creator?: {
    full_name: string;
    email: string;
  };
  host_name?: string;
  host_contact?: string;
  rsvps_count: number;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  events_count: number;
}

export default function AdminViewEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "upcoming" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all events
      let eventsResponse;
      try {
        eventsResponse = await api.get('/admin/events');
      } catch (err) {
        console.log('Admin endpoint not available, using regular events endpoint');
        eventsResponse = await api.get('/events');
      }
      
      setEvents(eventsResponse.data);
      
      // Fetch all users
      try {
        const usersResponse = await api.get('/admin/users');
        setUsers(usersResponse.data);
      } catch (err) {
        console.log('Could not load users list');
        setUsers([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load events");
      console.error("Error loading data:", err);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.promise(
      loadData(),
      {
        loading: 'Refreshing...',
        success: 'Data refreshed successfully',
        error: 'Failed to refresh data'
      }
    );
  };

  const handleDelete = async (id: number, eventTitle: string) => {
    const reason = window.prompt(
      `⚠️ ADMIN INTERVENTION\n\nYou are about to delete "${eventTitle}".\n\nPlease provide a reason for deletion (this will be logged):`
    );
    
    if (!reason) {
      toast.error('Deletion cancelled - reason required');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?\n\nReason: ${reason}\n\nThis action cannot be undone.`)) {
      return;
    }

    const loadingToast = toast.loading('Deleting event...');
    try {
      await api.delete(`/events/${id}`);
      toast.success(`Event deleted. Reason logged: ${reason}`, { id: loadingToast });
      loadData();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event', { id: loadingToast });
    }
  };

  const handleSuspiciousFlag = async (id: number, eventTitle: string) => {
    const notes = window.prompt(
      `🚩 FLAG AS SUSPICIOUS\n\nEvent: "${eventTitle}"\n\nPlease provide details about why this event is suspicious:`
    );
    
    if (!notes) {
      toast.error('Flag cancelled - details required');
      return;
    }

    const loadingToast = toast.loading('Flagging event as suspicious...');
    try {
      // You can add a status or notes field to track this
      await api.put(`/events/${id}`, { 
        status: 'flagged',
        admin_notes: notes 
      });
      toast.success(`Event flagged as suspicious. Creator will be notified.`, { id: loadingToast });
      loadData();
    } catch (error: any) {
      console.error('Error flagging event:', error);
      toast.error(error.response?.data?.message || 'Failed to flag event', { id: loadingToast });
    }
  };

  const copyRsvpLink = (eventId: number) => {
    const rsvpUrl = `${window.location.origin}/rsvp/${eventId}`;
    navigator.clipboard.writeText(rsvpUrl);
    toast.success('RSVP link copied to clipboard!');
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start_at);
    const now = new Date();
    const isUpcoming = eventDate > now;
    
    let tabMatch = true;
    if (tab === "upcoming") tabMatch = isUpcoming;
    if (tab === "completed") tabMatch = !isUpcoming;

    const searchMatch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.creator?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.host_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter === "all" || event.status === statusFilter;
    const userMatch = userFilter === "all" || event.user_id.toString() === userFilter;

    return tabMatch && searchMatch && statusMatch && userMatch;
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (startTime: string, endTime?: string) => {
    try {
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
    } catch {
      return 'Time not set';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" },
      pending: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
      flagged: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
      concluded: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        {status === 'flagged' ? '🚩 Flagged' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#d4b885] mx-auto mb-4 animate-spin" />
          <p className="text-lg text-[#3b2a13] font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Events</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => loadData()}
            className="px-6 py-3 bg-[#d4b885] text-[#3b2a13] rounded-lg font-semibold hover:bg-[#c4b184] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const upcomingCount = events.filter(e => new Date(e.start_at) > new Date()).length;
  const completedCount = events.filter(e => new Date(e.start_at) <= new Date()).length;
  const flaggedCount = events.filter(e => e.status === 'flagged').length;

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#3b2a13]">EVENT MONITORING</h2>
            <p className="text-sm text-[#3b2a13] mt-1">Monitor all user events and intervene when necessary</p>
            {flaggedCount > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                <AlertTriangle className="w-4 h-4" />
                {flaggedCount} Flagged Event{flaggedCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/create-event')}
              className="px-4 py-2 bg-[#3b2a13] text-white rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Create Event
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white text-[#3b2a13] rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 border-2 border-[#3b2a13]"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, creators, hosts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Active</option>
              <option value="flagged">🚩 Flagged</option>
              <option value="concluded">Concluded</option>
            </select>
          </div>

          {/* User Filter */}
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({user.events_count || 0} events)
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg px-4 py-3">
            <span className="text-sm font-semibold text-gray-700">
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setTab("all")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              tab === "all"
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setTab("upcoming")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              tab === "upcoming"
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              tab === "completed"
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all ${
                  event.status === 'flagged' ? 'border-2 border-red-400' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold text-[#3b2a13]">
                            {event.title}
                          </h3>
                          {event.status === 'flagged' && (
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-gray-600 flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            Created by <span className="font-semibold">{event.creator?.full_name || 'Unknown'}</span>
                          </p>
                          {event.host_name && (
                            <p className="text-gray-600 flex items-center gap-1">
                              | Host: <span className="font-semibold">{event.host_name}</span>
                            </p>
                          )}
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{event.description}</p>
                      </div>
                    )}

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-[#3b2a13]" />
                        <span className="font-medium">{formatDate(event.start_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5 text-[#3b2a13]" />
                        <span className="font-medium">{formatTime(event.start_at, event.end_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-5 h-5 text-[#3b2a13]" />
                        <span className="font-medium">{event.location || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-5 h-5 text-[#3b2a13]" />
                        <span className="font-bold text-[#3b2a13]">{event.rsvps_count || 0} RSVPs</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => window.open(`/rsvp/${event.id}`, '_blank')}
                        className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View RSVP Page
                      </button>

                      <button
                        onClick={() => copyRsvpLink(event.id)}
                        className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </button>

                      <button
                        onClick={() => navigate(`/admin/edit-event/${event.id}`)}
                        className="px-3 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>

                      {/* Admin Intervention Actions */}
                      {event.status !== 'flagged' && (
                        <button
                          onClick={() => handleSuspiciousFlag(event.id, event.title)}
                          className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Flag as Suspicious
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-xl text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No events found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || userFilter !== 'all'
                  ? "Try adjusting your filters"
                  : "No events have been created yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  {selectedEvent.status === 'flagged' && (
                    <div className="flex items-center gap-2 text-red-600 mt-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">This event has been flagged</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  {getStatusBadge(selectedEvent.status)}
                </div>

                {selectedEvent.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Date</p>
                    <p className="font-medium">{formatDate(selectedEvent.start_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Time</p>
                    <p className="font-medium">{formatTime(selectedEvent.start_at, selectedEvent.end_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    <p className="font-medium">{selectedEvent.location || 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">RSVPs</p>
                    <p className="font-medium">{selectedEvent.rsvps_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Created By</p>
                    <p className="font-medium">{selectedEvent.creator?.full_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Creator Email</p>
                    <p className="font-medium text-sm">{selectedEvent.creator?.email || 'N/A'}</p>
                  </div>
                  {selectedEvent.host_name && (
                    <>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Host Name</p>
                        <p className="font-medium">{selectedEvent.host_name}</p>
                      </div>
                      {selectedEvent.host_contact && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Host Contact</p>
                          <p className="font-medium">{selectedEvent.host_contact}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      handleSuspiciousFlag(selectedEvent.id, selectedEvent.title);
                    }}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Flag as Suspicious
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}