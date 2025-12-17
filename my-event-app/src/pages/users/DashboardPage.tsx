import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, TrendingUp, Bell, Search, Filter, RefreshCw, Plus, FileText, Eye, Edit, AlertCircle, Download, ExternalLink } from 'lucide-react';
import dashboardBg from "../../assets/dashboard-bg.png";
import api from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}

interface EventCardProps {
  event: {
    id: number;
    title: string;
    start_at: string;
    location?: string;
    rsvps_count: number;
    status: string;
  };
  onViewDetails: (event: any) => void;
}

interface Event {
  id: number;
  title: string;
  start_at: string;
  end_at?: string;
  location?: string;
  rsvps_count: number;
  status: string;
  description?: string;
}

function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, onViewDetails }: EventCardProps) {
  const navigate = useNavigate();
  
  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    concluded: "bg-blue-100 text-blue-800"
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewRSVPs = () => {
    navigate('/user/rsvps', { state: { eventId: event.id } });
  };

  const copyRSVPLink = async () => {
    const rsvpUrl = `${window.location.origin}/rsvp/${event.id}`;
    try {
      await navigator.clipboard.writeText(rsvpUrl);
      toast.success('RSVP link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy RSVP link');
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-500 mt-1">📅 {formatDate(event.start_at)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${(statusColors as any)[event.status] || 'bg-gray-100 text-gray-800'}`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>{event.rsvps_count || 0} RSVPs</span>
        </div>
        {event.location && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(event)}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all text-sm flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={handleViewRSVPs}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-all text-sm flex items-center justify-center gap-1"
        >
          <Users className="w-4 h-4" />
          RSVPs
        </button>
        <button
          onClick={copyRSVPLink}
          className="px-3 bg-purple-500 text-white py-2 rounded-lg font-medium hover:bg-purple-600 transition-all text-sm"
          title="Copy RSVP Link"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function EnhancedEventDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter events based on search and filter
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(event => event.status === filterType);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filterType]);

  const loadData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get('/events');
      const eventsData = response.data;

      setEvents(eventsData);
      setFilteredEvents(eventsData);

      // Calculate stats from events
      const now = new Date();
      const statsData = {
        totalEvents: eventsData.length,
        upcomingEvents: eventsData.filter((e: Event) => new Date(e.start_at) > now).length,
        totalRsvps: eventsData.reduce((sum: number, e: Event) => sum + (e.rsvps_count || 0), 0),
        approvedEvents: eventsData.filter((e: Event) => e.status === 'approved').length
      };

      setStats(statsData);

      if (showRefreshIndicator) {
        toast.success('Dashboard refreshed successfully');
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      const errorMessage = error.response?.data?.message || 'Failed to load dashboard data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const handleCreateEvent = () => {
    navigate('/user/create-event');
  };

  const handleViewCalendar = () => {
    navigate('/user/view-events');
  };

  const handleExportReports = () => {
    // Generate CSV report
    const csvData = filteredEvents.map(event => ({
      Title: event.title,
      Date: new Date(event.start_at).toLocaleDateString(),
      Location: event.location || 'N/A',
      Status: event.status,
      RSVPs: event.rsvps_count || 0
    }));

    const headers = ['Title', 'Date', 'Location', 'Status', 'RSVPs'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${(row as any)[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `events-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Report exported successfully');
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      navigate('/user/view-events'); // Will open in edit mode via the inline editing
      setSelectedEvent(null);
    }
  };

  const handleViewAttendees = () => {
    if (selectedEvent) {
      navigate('/user/rsvps', { state: { eventId: selectedEvent.id } });
      setSelectedEvent(null);
    }
  };

  const copyRSVPLink = async (eventId: number) => {
    const rsvpUrl = `${window.location.origin}/rsvp/${eventId}`;
    try {
      await navigator.clipboard.writeText(rsvpUrl);
      toast.success('RSVP link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy RSVP link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <Toaster position="top-right" />
      {/* Semi-transparent overlay for better readability */}
      <div className="min-h-screen bg-black/40 backdrop-blur-sm p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Event Dashboard</h1>
              <p className="text-white/90 drop-shadow">Manage and monitor all your events in one place</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/20 backdrop-blur-md text-white p-3 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error loading dashboard</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Calendar}
              label="Total Events"
              value={stats?.totalEvents || 0}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Users}
              label="Total RSVPs"
              value={stats?.totalRsvps || 0}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Upcoming Events"
              value={stats?.upcomingEvents || 0}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              icon={DollarSign}
              label="Approved Events"
              value={stats?.approvedEvents || 0}
              color="bg-gradient-to-br from-amber-500 to-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="draft">Draft</option>
                      <option value="concluded">Concluded</option>
                    </select>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Events</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewDetails={handleViewEvent}
                    />
                  ))}
                </div>

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      {searchTerm || filterType !== "all" 
                        ? "No events found matching your filters" 
                        : "No events yet"}
                    </p>
                    {!searchTerm && filterType === "all" && (
                      <button
                        onClick={handleCreateEvent}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                      >
                        Create Your First Event
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={handleCreateEvent}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Event
                  </button>
                  <button
                    onClick={handleViewCalendar}
                    className="w-full bg-white border-2 border-amber-500 text-amber-600 py-3 rounded-lg font-medium hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    View All Events
                  </button>
                  <button
                    onClick={handleExportReports}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export Reports
                  </button>
                  <button
                    onClick={() => navigate('/user/rsvps')}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Manage RSVPs
                  </button>
                </div>

                {/* Recent Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Events</span>
                      <span className="font-bold text-gray-900">{stats?.totalEvents || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Upcoming</span>
                      <span className="font-bold text-purple-600">{stats?.upcomingEvents || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total RSVPs</span>
                      <span className="font-bold text-green-600">{stats?.totalRsvps || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Detail Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedEvent(null)}>
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedEvent.title}</h2>
                    <p className="text-gray-600 mt-1">Event Details</p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">Date:</span>
                    <span className="text-gray-600">{new Date(selectedEvent.start_at).toLocaleDateString()}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-amber-500" />
                      <span className="font-medium">Location:</span>
                      <span className="text-gray-600">{selectedEvent.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">RSVPs:</span>
                    <span className="text-gray-600">{selectedEvent.rsvps_count || 0}</span>
                  </div>
                  {selectedEvent.description && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{selectedEvent.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleEditEvent}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Event
                  </button>
                  <button
                    onClick={handleViewAttendees}
                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View RSVPs
                  </button>
                  <button
                    onClick={() => copyRSVPLink(selectedEvent.id)}
                    className="px-4 bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-all"
                    title="Copy RSVP Link"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}