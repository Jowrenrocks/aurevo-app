import { useState, useEffect } from "react";
import { Users, UserCheck, UserX, User, Download, Search, Filter, Eye, X } from "lucide-react";
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface RSVP {
  id: number;
  event_id: number;
  event?: {
    title: string;
  };
  attendee_name: string;
  email: string;
  phone: string;
  status: "yes" | "no" | "maybe";
  guests: number;
  reason_for_declining?: string;
  special_requests?: string;
  created_at: string;
}

export default function UserRSVPPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [filteredRsvps, setFilteredRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [selectedRsvp, setSelectedRsvp] = useState<RSVP | null>(null);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const response = await api.get('/rsvps');
        setRsvps(response.data);
        setFilteredRsvps(response.data);
      } catch (error) {
        console.error('Error fetching RSVPs:', error);
        toast.error('Failed to load RSVPs');
        setRsvps([]);
        setFilteredRsvps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRsvps();
  }, []);

  useEffect(() => {
    let filtered = rsvps;

    if (searchTerm) {
      filtered = filtered.filter(rsvp =>
        rsvp.attendee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(rsvp => rsvp.status === statusFilter);
    }

    if (eventFilter !== "all") {
      filtered = filtered.filter(rsvp => rsvp.event_id.toString() === eventFilter);
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
        {status === 'yes' ? 'Attending' : status === 'no' ? 'Not Attending' : 'Maybe'}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ["Event", "Attendee Name", "Email", "Phone", "Status", "Guests", "Reason for Declining", "Special Requests", "RSVP Date"];
    const csvData = filteredRsvps.map(rsvp => [
      rsvp.event?.title || 'N/A',
      rsvp.attendee_name,
      rsvp.email,
      rsvp.phone,
      rsvp.status,
      rsvp.guests || 0,
      rsvp.reason_for_declining || 'N/A',
      rsvp.special_requests || 'N/A',
      new Date(rsvp.created_at).toLocaleString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rsvp_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  const uniqueEvents = rsvps.reduce((acc: { id: number; title: string }[], rsvp) => {
    if (rsvp.event && !acc.some(event => event.id === rsvp.event_id)) {
      acc.push({ id: rsvp.event_id, title: rsvp.event.title });
    }
    return acc;
  }, []);

  const stats = {
    total: filteredRsvps.length,
    attending: filteredRsvps.filter(r => r.status === "yes").length,
    notAttending: filteredRsvps.filter(r => r.status === "no").length,
    maybe: filteredRsvps.filter(r => r.status === "maybe").length,
    totalGuests: filteredRsvps.reduce((sum, r) => sum + (r.guests || 0), 0)
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rsvp.attendee_name}</div>
                      <div className="text-sm text-gray-500">{rsvp.email}</div>
                      <div className="text-sm text-gray-500">{rsvp.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{rsvp.event?.title || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(rsvp.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rsvp.status === 'yes' ? (rsvp.guests || 1) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rsvp.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSelectedRsvp(rsvp)}
                      className="text-[#d4b885] hover:text-[#c4b184] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
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

      {/* RSVP Detail Modal */}
      {selectedRsvp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRsvp(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRsvp.attendee_name}</h2>
                  <p className="text-gray-600 mt-1">RSVP Details</p>
                </div>
                <button
                  onClick={() => setSelectedRsvp(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedRsvp.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedRsvp.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Response Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedRsvp.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event:</span>
                      <span className="font-medium">{selectedRsvp.event?.title || 'N/A'}</span>
                    </div>
                    {selectedRsvp.status === 'yes' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Guests:</span>
                        <span className="font-medium">{selectedRsvp.guests || 1}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">RSVP Date:</span>
                      <span className="font-medium">{new Date(selectedRsvp.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedRsvp.status === 'no' && selectedRsvp.reason_for_declining && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Reason for Declining</h3>
                    <p className="text-sm text-red-800">{selectedRsvp.reason_for_declining}</p>
                  </div>
                )}

                {(selectedRsvp.status === 'yes' || selectedRsvp.status === 'maybe') && selectedRsvp.special_requests && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Special Requests</h3>
                    <p className="text-sm text-blue-800">{selectedRsvp.special_requests}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedRsvp(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}