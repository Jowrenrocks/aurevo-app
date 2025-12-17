import { useState, useEffect } from "react";
import { Users, UserCheck, UserX, User, Download, Search, Filter } from "lucide-react";

interface RSVP {
  id: number;
  eventId: number;
  eventTitle: string;
  attendeeName: string;
  email: string;
  phone: string;
  status: "yes" | "no" | "maybe";
  guests: number;
  specialRequests: string;
  rsvpDate: string;
}

export default function RSVPPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [filteredRsvps, setFilteredRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");

  useEffect(() => {
    // Mock data - replace with API calls
    const mockRsvps: RSVP[] = [
      {
        id: 1,
        eventId: 1,
        eventTitle: "Corporate Gala 2025",
        attendeeName: "John Smith",
        email: "john.smith@company.com",
        phone: "+63 912 345 6789",
        status: "yes" as const,
        guests: 2,
        specialRequests: "Vegetarian meal for one guest",
        rsvpDate: "2025-11-10T14:30:00Z"
      },
      {
        id: 2,
        eventId: 1,
        eventTitle: "Corporate Gala 2025",
        attendeeName: "Maria Garcia",
        email: "maria.garcia@email.com",
        phone: "+63 923 456 7890",
        status: "yes" as const,
        guests: 1,
        specialRequests: "",
        rsvpDate: "2025-11-09T16:45:00Z"
      },
      {
        id: 3,
        eventId: 2,
        eventTitle: "Wedding - Smith & Jones",
        attendeeName: "Robert Johnson",
        email: "robert.j@email.com",
        phone: "+63 934 567 8901",
        status: "maybe" as const,
        guests: 3,
        specialRequests: "Need high chair for toddler",
        rsvpDate: "2025-11-08T11:20:00Z"
      },
      {
        id: 4,
        eventId: 3,
        eventTitle: "Birthday Celebration",
        attendeeName: "Sarah Wilson",
        email: "sarah.w@email.com",
        phone: "+63 945 678 9012",
        status: "no" as const,
        guests: 1,
        specialRequests: "",
        rsvpDate: "2025-11-07T09:15:00Z"
      },
      {
        id: 5,
        eventId: 2,
        eventTitle: "Wedding - Smith & Jones",
        attendeeName: "David Brown",
        email: "david.brown@email.com",
        phone: "+63 956 789 0123",
        status: "yes" as const,
        guests: 2,
        specialRequests: "Allergic to nuts",
        rsvpDate: "2025-11-06T13:40:00Z"
      }
    ];

    setRsvps(mockRsvps);
    setFilteredRsvps(mockRsvps);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = rsvps;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(rsvp =>
        rsvp.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(rsvp => rsvp.status === statusFilter);
    }

    // Apply event filter
    if (eventFilter !== "all") {
      filtered = filtered.filter(rsvp => rsvp.eventId.toString() === eventFilter);
    }

    setFilteredRsvps(filtered);
  }, [rsvps, searchTerm, statusFilter, eventFilter]);

  const getStatusBadge = (status: string) => {
    const styles = {
      yes: "bg-green-100 text-green-800 border-green-300",
      no: "bg-red-100 text-red-800 border-red-300",
      maybe: "bg-yellow-100 text-yellow-800 border-yellow-300"
    };

    const icons = {
      yes: <UserCheck className="w-3 h-3" />,
      no: <UserX className="w-3 h-3" />,
      maybe: <User className="w-3 h-3" />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ["Event", "Attendee Name", "Email", "Phone", "Status", "Guests", "Special Requests", "RSVP Date"];
    const csvData = filteredRsvps.map(rsvp => [
      rsvp.eventTitle,
      rsvp.attendeeName,
      rsvp.email,
      rsvp.phone,
      rsvp.status,
      rsvp.guests,
      rsvp.specialRequests,
      new Date(rsvp.rsvpDate).toLocaleString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "rsvp_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueEvents = rsvps.reduce((acc: { id: number; title: string }[], rsvp) => {
    if (!acc.some(event => event.id === rsvp.eventId)) {
      acc.push({ id: rsvp.eventId, title: rsvp.eventTitle });
    }
    return acc;
  }, []);
  const stats = {
    total: filteredRsvps.length,
    attending: filteredRsvps.filter(r => r.status === "yes").length,
    notAttending: filteredRsvps.filter(r => r.status === "no").length,
    maybe: filteredRsvps.filter(r => r.status === "maybe").length,
    totalGuests: filteredRsvps.reduce((sum, r) => sum + r.guests, 0)
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b885] mx-auto"></div>
          <p className="mt-4 text-[#3b2a13]">Loading RSVPs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3b2a13]">RSVP MANAGEMENT</h2>
            <p className="text-sm text-[#3b2a13]">Manage attendee responses and guest lists</p>
          </div>
          <button
            onClick={exportToCSV}
            className="px-6 py-3 bg-[#3b2a13] text-white rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-[#d4b885]" />
          <p className="text-2xl font-bold text-[#3b2a13]">{stats.total}</p>
          <p className="text-xs text-gray-600">Total RSVPs</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-md text-center border border-green-200">
          <UserCheck className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-600">{stats.attending}</p>
          <p className="text-xs text-gray-600">Attending</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-md text-center border border-red-200">
          <UserX className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <p className="text-2xl font-bold text-red-600">{stats.notAttending}</p>
          <p className="text-xs text-gray-600">Not Attending</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow-md text-center border border-yellow-200">
          <User className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
          <p className="text-2xl font-bold text-yellow-600">{stats.maybe}</p>
          <p className="text-xs text-gray-600">Maybe</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow-md text-center border border-blue-200">
          <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-600">{stats.totalGuests}</p>
          <p className="text-xs text-gray-600">Total Guests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="yes">Attending</option>
              <option value="no">Not Attending</option>
              <option value="maybe">Maybe</option>
            </select>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
            >
              <option value="all">All Events</option>
              {uniqueEvents.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RSVP List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Requests</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rsvp.attendeeName}</div>
                      <div className="text-sm text-gray-500">{rsvp.email}</div>
                      <div className="text-sm text-gray-500">{rsvp.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{rsvp.eventTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(rsvp.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rsvp.guests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rsvp.rsvpDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {rsvp.specialRequests || "None"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRsvps.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No RSVPs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
