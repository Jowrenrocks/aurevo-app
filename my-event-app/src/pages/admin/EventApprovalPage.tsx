import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, CheckCircle, XCircle, Eye, DollarSign } from 'lucide-react';
import dashboardBg from "../../assets/dashboard-bg.png";

// Mock data - replace with real API calls
const mockPendingEvents = [
  {
    id: 1,
    title: "Corporate Annual Gala 2025",
    organizer: "John Smith",
    email: "john.smith@company.com",
    phone: "+63 912 345 6789",
    eventType: "corporate",
    date: "2025-12-15",
    startTime: "18:00",
    endTime: "23:00",
    venue: "Tagoloan Convention Center",
    expectedGuests: 250,
    services: ["Catering", "Photography", "DJ/Entertainment"],
    totalCost: 125000,
    notes: "Need vegan food options",
    status: "pending",
    submittedAt: "2025-11-10"
  },
  {
    id: 2,
    title: "Wedding Reception - Smith & Jones",
    organizer: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+63 923 456 7890",
    eventType: "wedding",
    date: "2025-11-28",
    startTime: "16:00",
    endTime: "22:00",
    venue: "Luxury Garden Resort",
    expectedGuests: 150,
    services: ["Catering", "Photography", "Videography", "Decorations"],
    totalCost: 185000,
    notes: "Outdoor ceremony, need backup indoor option",
    status: "pending",
    submittedAt: "2025-11-08"
  },
  {
    id: 3,
    title: "Birthday Party - 50th Celebration",
    organizer: "Robert Johnson",
    email: "robert.j@email.com",
    phone: "+63 934 567 8901",
    eventType: "birthday",
    date: "2025-12-01",
    startTime: "19:00",
    endTime: "23:00",
    venue: "Private Residence",
    expectedGuests: 80,
    services: ["Catering", "DJ/Entertainment"],
    totalCost: 45000,
    notes: "Surprise party - please be discreet",
    status: "pending",
    submittedAt: "2025-11-12"
  }
];

interface Event {
  id: number;
  title: string;
  organizer: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  expectedGuests: number;
  services: string[];
  totalCost: number;
  notes: string;
  status: string;
  submittedAt: string;
}

function EventTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    wedding: "bg-pink-100 text-pink-800 border-pink-300",
    corporate: "bg-blue-100 text-blue-800 border-blue-300",
    birthday: "bg-purple-100 text-purple-800 border-purple-300",
    anniversary: "bg-rose-100 text-rose-800 border-rose-300",
    other: "bg-gray-100 text-gray-800 border-gray-300"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[type] || colors.other}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function EventDetailModal({ event, onClose, onApprove, onDecline }: { 
  event: Event; 
  onClose: () => void;
  onApprove: (id: number) => void;
  onDecline: (id: number, reason: string) => void;
}) {
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineForm, setShowDeclineForm] = useState(false);

  const handleDecline = () => {
    if (declineReason.trim()) {
      onDecline(event.id, declineReason);
      setShowDeclineForm(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
              <EventTypeBadge type={event.eventType} />
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-3xl font-light">×</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Organizer Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-lg mb-3 text-gray-900">Organizer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <p className="text-gray-900">{event.organizer}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="text-gray-900">{event.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Phone:</span>
                <p className="text-gray-900">{event.phone}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Submitted:</span>
                <p className="text-gray-900">{new Date(event.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Date</p>
                <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Time</p>
                <p className="text-gray-600">{event.startTime} - {event.endTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
              <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Venue</p>
                <p className="text-gray-600">{event.venue}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
              <Users className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Expected Guests</p>
                <p className="text-gray-600">{event.expectedGuests} people</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">Requested Services</h3>
            <div className="flex flex-wrap gap-2">
              {event.services.map((service, idx) => (
                <span key={idx} className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Cost */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-bold text-lg text-gray-900">Total Cost</span>
              </div>
              <span className="text-3xl font-bold text-green-600">₱{event.totalCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Special Notes */}
          {event.notes && (
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Special Requests</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-gray-700">{event.notes}</p>
              </div>
            </div>
          )}

          {/* Decline Form */}
          {showDeclineForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 text-red-900">Reason for Decline</h3>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Please provide a reason for declining this event..."
                rows={4}
                className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t flex gap-3 justify-end">
          {!showDeclineForm ? (
            <>
              <button
                onClick={() => setShowDeclineForm(true)}
                className="px-6 py-3 bg-white border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Decline
              </button>
              <button
                onClick={() => {
                  onApprove(event.id);
                  onClose();
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Event
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowDeclineForm(false);
                  setDeclineReason("");
                }}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                disabled={!declineReason.trim()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Decline
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminApprovalDashboard() {
  const [events, setEvents] = useState<Event[]>(mockPendingEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleApprove = (id: number) => {
    setEvents(events.map(e => e.id === id ? { ...e, status: "approved" } : e));
    alert("Event approved successfully!");
  };

  const handleDecline = (id: number, reason: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, status: "declined" } : e));
    alert(`Event declined. Reason: ${reason}`);
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === "all" || event.eventType === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch && event.status === "pending";
  });

  return (
    <div 
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Approval Dashboard</h1>
            <p className="text-gray-600">Review and approve pending event requests</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-yellow-100 rounded-2xl p-6 border-2 border-yellow-300">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Pending Approval</h3>
              <p className="text-4xl font-bold text-yellow-700">{events.filter(e => e.status === "pending").length}</p>
            </div>
            <div className="bg-green-100 rounded-2xl p-6 border-2 border-green-300">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Approved</h3>
              <p className="text-4xl font-bold text-green-700">{events.filter(e => e.status === "approved").length}</p>
            </div>
            <div className="bg-red-100 rounded-2xl p-6 border-2 border-red-300">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Declined</h3>
              <p className="text-4xl font-bold text-red-700">{events.filter(e => e.status === "declined").length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by title or organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div key={event.id} className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                          <EventTypeBadge type={event.eventType} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{event.organizer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span>₱{event.totalCost.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {event.services.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                            {service}
                          </span>
                        ))}
                        {event.services.length > 3 && (
                          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                            +{event.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="flex-1 md:flex-none px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-12 text-center">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Events</h3>
                <p className="text-gray-500">All events have been reviewed!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
}