import { useState, useEffect } from "react";
import { Calendar, Users, Eye, AlertTriangle, Activity, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

interface Stats {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  flagged_events: number;
  total_users: number;
  total_rsvps: number;
  events_by_status: Record<string, number>;
  rsvp_breakdown: {
    yes: number;
    no: number;
    maybe: number;
  };
  recent_events: Array<{
    id: number;
    title: string;
    start_at: string;
    status: string;
    rsvps_count: number;
    creator: {
      full_name: string;
    };
  }>;
  flagged_events_list: Array<{
    id: number;
    title: string;
    start_at: string;
    creator: {
      full_name: string;
    };
    rsvps_count: number;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    toast.promise(
      fetchStats(),
      {
        loading: 'Refreshing statistics...',
        success: 'Dashboard updated!',
        error: 'Failed to refresh'
      }
    );
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#d4b885] mx-auto mb-4 animate-spin" />
          <p className="text-lg text-[#3b2a13] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-red-600 mb-4">{error || 'Failed to load statistics'}</p>
          <button
            onClick={fetchStats}
            className="px-6 py-3 bg-[#d4b885] text-[#3b2a13] rounded-lg font-semibold hover:bg-[#c4b184] transition-colors"
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
      
      {/* Header */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3b2a13]">ADMIN MONITORING DASHBOARD</h2>
            <p className="text-sm text-[#3b2a13] mt-1">Monitor all events and intervene when necessary</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white text-[#3b2a13] rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Alert for Flagged Events */}
      {stats.flagged_events > 0 && (
        <div className="bg-red-50 border-2 border-red-400 p-4 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="text-lg font-bold text-red-900">
                  ⚠️ {stats.flagged_events} Flagged Event{stats.flagged_events !== 1 ? 's' : ''} Requiring Attention
                </h3>
                <p className="text-sm text-red-700">Review suspicious events immediately</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/events')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Review Now
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Events</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total_events}</p>
          <p className="text-sm text-gray-600 mt-1">All time</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-green-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Upcoming</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.upcoming_events}</p>
          <p className="text-sm text-gray-600 mt-1">Active events</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Total RSVPs</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total_rsvps}</p>
          <p className="text-sm text-gray-600 mt-1">All events</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Flagged</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.flagged_events}</p>
          <p className="text-sm text-gray-600 mt-1">Needs review</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Event Status Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-gray-700">Active Events</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats.events_by_status.pending || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Draft Events</span>
              <span className="text-2xl font-bold text-gray-600">
                {stats.events_by_status.draft || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-gray-700">Flagged Events</span>
              <span className="text-2xl font-bold text-red-600">
                {stats.events_by_status.flagged || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium text-gray-700">Concluded Events</span>
              <span className="text-2xl font-bold text-purple-600">
                {stats.events_by_status.concluded || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">RSVP Response Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-700">✅ Attending</span>
              <span className="text-2xl font-bold text-green-600">
                {stats.rsvp_breakdown.yes}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-gray-700">❌ Not Attending</span>
              <span className="text-2xl font-bold text-red-600">
                {stats.rsvp_breakdown.no}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-gray-700">❓ Maybe</span>
              <span className="text-2xl font-bold text-yellow-600">
                {stats.rsvp_breakdown.maybe}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <span className="font-medium text-gray-700">📊 Total Responses</span>
              <span className="text-2xl font-bold text-gray-900">
                {stats.total_rsvps}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Events (if any) */}
      {stats.flagged_events_list && stats.flagged_events_list.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border-2 border-red-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Flagged Events Requiring Review
            </h3>
            <button
              onClick={() => navigate('/admin/events')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
            >
              View All Flagged
            </button>
          </div>
          <div className="space-y-3">
            {stats.flagged_events_list.map(event => (
              <div key={event.id} className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    By {event.creator.full_name} • {new Date(event.start_at).toLocaleDateString()} • {event.rsvps_count} RSVPs
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin/events')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Events</h3>
          <button
            onClick={() => navigate('/admin/events')}
            className="text-[#d4b885] hover:text-[#c4b184] font-semibold text-sm flex items-center gap-1"
          >
            View All
            <Eye className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {stats.recent_events.map(event => (
            <div key={event.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600">
                  By {event.creator.full_name} • {new Date(event.start_at).toLocaleDateString()} • {event.rsvps_count} RSVPs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'flagged' ? 'bg-red-100 text-red-800' :
                  event.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'concluded' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status === 'flagged' ? '🚩 Flagged' : 
                   event.status === 'pending' ? 'Active' :
                   event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/admin/create-event')}
          className="p-6 bg-gradient-to-br from-[#d4b885] to-[#c4b184] rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
        >
          <Calendar className="w-8 h-8 text-[#3b2a13] mb-3" />
          <h3 className="text-xl font-bold text-[#3b2a13] mb-1">Create Event</h3>
          <p className="text-sm text-[#3b2a13]">Add a new event to the platform</p>
        </button>

        <button
          onClick={() => navigate('/admin/events')}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
        >
          <Eye className="w-8 h-8 text-white mb-3" />
          <h3 className="text-xl font-bold text-white mb-1">Monitor Events</h3>
          <p className="text-sm text-white">View and manage all user events</p>
        </button>

        <button
          onClick={() => navigate('/admin/rsvps')}
          className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
        >
          <Users className="w-8 h-8 text-white mb-3" />
          <h3 className="text-xl font-bold text-white mb-1">View RSVPs</h3>
          <p className="text-sm text-white">Track all attendee responses</p>
        </button>
      </div>
    </div>
  );
}