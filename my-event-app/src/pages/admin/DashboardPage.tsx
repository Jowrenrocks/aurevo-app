import { useState, useEffect } from "react";
import { Calendar, Users, TrendingUp, CheckCircle, Clock, UserCheck, UserX, User, AlertCircle, RefreshCw } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

interface Event {
  id: number;
  title: string;
  start_at: string;
  rsvps_count: number;
  status: string;
  creator: {
    full_name: string;
  };
}

interface RSVPStats {
  yes: number;
  no: number;
  maybe: number;
}

interface DashboardStats {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  total_users: number;
  total_rsvps: number;
  events_by_status: {
    draft?: number;
    pending?: number;
    approved?: number;
    declined?: number;
    concluded?: number;
  };
  recent_events: Event[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [rsvpStats, setRsvpStats] = useState<RSVPStats>({ yes: 0, no: 0, maybe: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch admin statistics
      const response = await api.get('/admin/stats');
      setStats(response.data);

      // Calculate RSVP stats (you can enhance this with a dedicated endpoint)
      // For now, using mock data - you can replace with actual API call
      setRsvpStats({
        yes: Math.floor(response.data.total_rsvps * 0.7),
        no: Math.floor(response.data.total_rsvps * 0.15),
        maybe: Math.floor(response.data.total_rsvps * 0.15)
      });

      if (showRefreshing) {
        toast.success('Dashboard refreshed successfully');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b885] mx-auto"></div>
          <p className="mt-4 text-[#3b2a13]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-300 mb-4">Unable to fetch dashboard statistics</p>
          <button
            onClick={() => loadDashboardData()}
            className="px-6 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalEventsStatusCount = Object.values(stats.events_by_status).reduce((a, b) => a + b, 0);
  const attendanceRate = stats.total_rsvps > 0 ? Math.round((rsvpStats.yes / stats.total_rsvps) * 100) : 0;

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3b2a13]">DASHBOARD OVERVIEW</h2>
            <p className="text-sm text-[#3b2a13]">Analytics and key metrics for all events</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b2a13] text-white rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-[#3b2a13]" />
          <h3 className="text-lg font-semibold mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">{stats.total_events}</p>
        </div>
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <Clock className="w-8 h-8 mx-auto mb-2 text-[#3b2a13]" />
          <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">{stats.upcoming_events}</p>
        </div>
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <Users className="w-8 h-8 mx-auto mb-2 text-[#3b2a13]" />
          <h3 className="text-lg font-semibold mb-2">Total RSVPs</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">{stats.total_rsvps}</p>
        </div>
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-[#3b2a13]" />
          <h3 className="text-lg font-semibold mb-2">Attendance Rate</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">{attendanceRate}%</p>
        </div>
      </div>

      {/* Event Status Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-[#3b2a13]">Event Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-2xl font-bold text-gray-700">{stats.events_by_status.draft || 0}</p>
            <p className="text-sm text-gray-600">Draft</p>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-lg">
            <p className="text-2xl font-bold text-yellow-700">{stats.events_by_status.pending || 0}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{stats.events_by_status.approved || 0}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          <div className="text-center p-4 bg-red-100 rounded-lg">
            <p className="text-2xl font-bold text-red-700">{stats.events_by_status.declined || 0}</p>
            <p className="text-sm text-gray-600">Declined</p>
          </div>
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{stats.events_by_status.concluded || 0}</p>
            <p className="text-sm text-gray-600">Concluded</p>
          </div>
        </div>
      </div>

      {/* RSVP Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-[#3b2a13]">RSVP Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Attending</p>
              <p className="text-2xl font-bold text-green-600">{rsvpStats.yes}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <UserX className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Not Attending</p>
              <p className="text-2xl font-bold text-red-600">{rsvpStats.no}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
            <User className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Maybe</p>
              <p className="text-2xl font-bold text-yellow-600">{rsvpStats.maybe}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-[#3b2a13]">Recent Events</h3>
        <div className="space-y-3">
          {stats.recent_events && stats.recent_events.length > 0 ? (
            stats.recent_events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#d4b885]" />
                  <div>
                    <h4 className="font-semibold text-[#3b2a13]">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.start_at)} • Created by {event.creator?.full_name || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{event.rsvps_count} RSVPs</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'approved' ? 'bg-green-100 text-green-800' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'declined' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent events</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-3 text-[#3b2a13]">SYSTEM OVERVIEW</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#3b2a13]">Total Users</span>
              <span className="font-bold text-[#3b2a13]">{stats.total_users}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#3b2a13]">Completed Events</span>
              <span className="font-bold text-[#3b2a13]">{stats.completed_events}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#3b2a13]">Avg. RSVPs per Event</span>
              <span className="font-bold text-[#3b2a13]">
                {stats.total_events > 0 ? Math.round(stats.total_rsvps / stats.total_events) : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-3 text-[#3b2a13]">QUICK ACTIONS</h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/admin/create-event'}
              className="w-full bg-[#3b2a13] text-white py-3 rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors"
            >
              Create New Event
            </button>
            <button
              onClick={() => window.location.href = '/admin/events'}
              className="w-full bg-white text-[#3b2a13] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border-2 border-[#3b2a13]"
            >
              View All Events
            </button>
            <button
              onClick={() => window.location.href = '/admin/rsvps'}
              className="w-full bg-white text-[#3b2a13] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border-2 border-[#3b2a13]"
            >
              Manage RSVPs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}