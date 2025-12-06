import { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, TrendingUp, Bell, Search, Filter } from 'lucide-react';
import dashboardBg from "../../assets/dashboard-bg.png";
import api from '../../utils/api';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;  // ← Add the ? to make it optional
  color: string;
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

function EventCard({ event, onViewDetails }) {
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800"
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-500 mt-1">📅 {new Date(event.date).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>{event.attendees} attendees</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>₱{event.revenue.toLocaleString()}</span>
        </div>
      </div>
      
      <button
        onClick={() => onViewDetails(event)}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
      >
        View Details
      </button>
    </div>
  );
}

function ActivityFeed({ activities }) {
  const typeIcons = {
    booking: "📅",
    payment: "💰",
    completion: "✅",
    update: "🔄"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <Bell className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
            <span className="text-2xl">{typeIcons[activity.type]}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EnhancedEventDashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      const eventsData = response.data;

      // Transform backend data to match frontend format
      const transformedEvents = eventsData.map((event: any) => {
        const eventDate = new Date(event.start_at);
        const now = new Date();
        const status = eventDate > now ? 'upcoming' : 'completed';

        return {
          id: event.id,
          title: event.title,
          date: event.start_at,
          attendees: 0, // Will be fetched separately if needed
          status: status,
          revenue: 0, // No revenue in API, set to 0
          type: 'general' // No type in API, set to general
        };
      });

      setEvents(transformedEvents);

      // Calculate stats from events
      const statsData = {
        totalEvents: transformedEvents.length,
        upcomingEvents: transformedEvents.filter((e: any) => e.status === 'upcoming').length,
        totalRevenue: 0, // No revenue data
        totalAttendees: 0, // No attendees count in list, would need separate calls
        recentActivity: [] // No activity API, leave empty for now
      };

      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
      {/* Semi-transparent overlay for better readability */}
      <div className="min-h-screen bg-black/40 backdrop-blur-sm p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Event Dashboard</h1>
            <p className="text-white/90 drop-shadow">Manage and monitor all your events in one place</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Calendar}
              label="Total Events"
              value={stats?.totalEvents || 0}
              trend="+12% this month"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Users}
              label="Total Attendees"
              value={stats?.totalAttendees?.toLocaleString() || 0}
              trend="+8% this month"
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`₱${(stats?.totalRevenue || 0).toLocaleString()}`}
              trend="+15% this month"
              color="bg-gradient-to-br from-amber-500 to-orange-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Upcoming Events"
              value={stats?.upcomingEvents || 0}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
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
                      <option value="all">All Types</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                    </select>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Events</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewDetails={setSelectedEvent}
                    />
                  ))}
                </div>

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No events found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
                <ActivityFeed activities={stats?.recentActivity || []} />
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
                    Create New Event
                  </button>
                  <button className="w-full bg-white border-2 border-amber-500 text-amber-600 py-3 rounded-lg font-medium hover:bg-amber-50 transition-all">
                    View Calendar
                  </button>
                  <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all">
                    Export Reports
                  </button>
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
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">Date:</span>
                    <span className="text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">Attendees:</span>
                    <span className="text-gray-600">{selectedEvent.attendees}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">Revenue:</span>
                    <span className="text-gray-600">₱{selectedEvent.revenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all">
                    Edit Event
                  </button>
                  <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all">
                    View Attendees
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