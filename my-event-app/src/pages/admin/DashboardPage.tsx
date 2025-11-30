import { useState, useEffect } from "react";
import { Calendar, Users, TrendingUp, CheckCircle, Clock, UserCheck, UserX, User } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  attendees: number;
  status: "upcoming" | "completed";
  revenue: number;
  type: string;
  rsvps_count: number;
}

interface RSVPStats {
  yes: number;
  no: number;
  maybe: number;
}

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvpStats, setRsvpStats] = useState<RSVPStats>({ yes: 0, no: 0, maybe: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API calls
    const mockEvents: Event[] = [
      { id: 1, title: "Corporate Gala 2025", date: "2025-12-15", attendees: 250, status: "upcoming", revenue: 125000, type: "corporate", rsvps_count: 250 },
      { id: 2, title: "Wedding - Smith & Jones", date: "2025-11-28", attendees: 150, status: "upcoming", revenue: 85000, type: "wedding", rsvps_count: 150 },
      { id: 3, title: "Birthday Celebration", date: "2025-11-20", attendees: 80, status: "upcoming", revenue: 35000, type: "birthday", rsvps_count: 80 },
      { id: 4, title: "Anniversary Party", date: "2025-10-15", attendees: 100, status: "completed", revenue: 45000, type: "anniversary", rsvps_count: 100 },
      { id: 5, title: "Tech Conference 2025", date: "2025-12-01", attendees: 500, status: "upcoming", revenue: 250000, type: "corporate", rsvps_count: 500 }
    ];

    const mockRsvpStats: RSVPStats = { yes: 650, no: 120, maybe: 210 };

    setEvents(mockEvents);
    setRsvpStats(mockRsvpStats);
    setLoading(false);
  }, []);

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const completedEvents = events.filter(e => e.status === "completed");
  const totalRsvps = events.reduce((sum, e) => sum + e.rsvps_count, 0);
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
  const attendanceRate = totalRsvps > 0 ? Math.round((totalAttendees / totalRsvps) * 100) : 0;

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

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-[#3b2a13]">DASHBOARD OVERVIEW</h2>
        <p className="text-sm text-[#3b2a13]">Analytics and key metrics for your events</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-[#3b2a13]" />
          <h3 className="text-lg font-semibold mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">{totalEvents}</p>
        </div>
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <Clock className="w-8 h-8 mx-auto mb-2 text-[#3b2a13]" />
          <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">{upcomingEvents.length}</p>
        </div>
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <Users className="w-8 h-8 mx-auto mb-2 text-[#3b2a13]" />
          <h3 className="text-lg font-semibold mb-2">Total RSVPs</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">{totalRsvps}</p>
        </div>
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-[#3b2a13]" />
          <h3 className="text-lg font-semibold mb-2">Attendance Rate</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">{attendanceRate}%</p>
        </div>
      </div>

      {/* RSVP Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-[#3b2a13]">RSVP Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Yes</p>
              <p className="text-2xl font-bold text-green-600">{rsvpStats.yes}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <UserX className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">No</p>
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

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-[#3b2a13]">Next 5 Upcoming Events</h3>
        <div className="space-y-3">
          {upcomingEvents.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#d4b885]" />
                <div>
                  <h4 className="font-semibold text-[#3b2a13]">{event.title}</h4>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{event.rsvps_count} RSVPs</p>
                <p className="text-sm font-semibold text-[#3b2a13]">₱{event.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-gray-500 text-center py-4">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-3 text-[#3b2a13]">RECENT NOTIFICATIONS</h3>
          <div className="space-y-3">
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-sm text-[#3b2a13]">Event reminder sent for "Corporate Gala 2025"</p>
              <p className="text-xs text-gray-600">2 hours ago</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-sm text-[#3b2a13]">New RSVP received for "Wedding Reception"</p>
              <p className="text-xs text-gray-600">5 hours ago</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <p className="text-sm text-[#3b2a13]">Event "Tech Conference" approved</p>
              <p className="text-xs text-gray-600">1 day ago</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-3 text-[#3b2a13]">QUICK STATS</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#3b2a13]">Completed Events</span>
              <span className="font-bold text-[#3b2a13]">{completedEvents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#3b2a13]">Total Revenue</span>
              <span className="font-bold text-[#3b2a13]">₱{events.reduce((sum, e) => sum + e.revenue, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#3b2a13]">Avg. Event Size</span>
              <span className="font-bold text-[#3b2a13]">{totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0} guests</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#3b2a13]">Active Users</span>
              <span className="font-bold text-[#3b2a13]">1,247</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
