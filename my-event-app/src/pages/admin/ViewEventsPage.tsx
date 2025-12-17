import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, Edit, Trash2, Eye, MoreVertical, Search, Filter, RefreshCw, User as UserIcon } from "lucide-react";
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
  rsvps_count: number;
  status: string;
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
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch all events (admin endpoint)
      const eventsResponse = await api.get('/admin/events');
      setEvents(eventsResponse.data);
      
      // Fetch all users
      const usersResponse = await api.get('/admin/users');
      setUsers(usersResponse.data);
    } catch (err: any) {
      setError("Failed to load events");
      console.error("Error loading data:", err);
      toast.error('Failed to load events and users');
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      loadData(); // Reload data
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/events/${id}`, { status: newStatus });
      toast.success(`Event status changed to ${newStatus}`);
      loadData(); // Reload data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update event status');
    }
  };

  const filteredEvents = events.filter(event => {
    // Tab filter
    const eventDate = new Date(event.start_at);
    const now = new Date();
    const isUpcoming = eventDate > now;
    
    let tabMatch = true;
    if (tab === "upcoming") tabMatch = isUpcoming;
    if (tab === "completed") tabMatch = !isUpcoming;

    // Search filter
    const searchMatch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.creator?.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = statusFilter === "all" || event.status === statusFilter;

    // User filter
    const userMatch = userFilter === "all" || event.user_id.toString() === userFilter;

    return tabMatch && searchMatch && statusMatch && userMatch;
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
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status as keyof typeof statusColors] || statusColors.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b885] mx-auto"></div>
          <p className="mt-4 text-[#3b2a13]">Loading events...</p>
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
            onClick={() => loadData()}
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3b2a13]">ALL EVENTS</h2>
            <p className="text-sm text-[#3b2a13] mt-1">Monitor all events from all users</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b2a13] text-white rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events or creators..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
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
                  {user.full_name} ({user.events_count} events)
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg px-4 py-3">
            <span className="text-sm font-medium text-gray-700">
              {filteredEvents.length} of {events.length} events
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
        <div className="flex gap-4 mb-6">
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
            Upcoming ({events.filter(e => new Date(e.start_at) > new Date()).length})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              tab === "completed"
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            Completed ({events.filter(e => new Date(e.start_at) <= new Date()).length})
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
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-gray-600 flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            Created by <span className="font-semibold">{event.creator?.full_name || 'Unknown'}</span>
                          </p>
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
                        <span>{event.rsvps_count} RSVPs</span>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit-event/${event.id}`)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => navigate(`/admin/rsvps?event=${event.id}`)}
                        className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View RSVPs
                      </button>

                      {event.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(event.id, 'approved')}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(event.id, 'declined')}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
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
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || userFilter !== 'all'
                  ? "Try adjusting your filters"
                  : "No events have been created yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}