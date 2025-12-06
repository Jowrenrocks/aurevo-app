import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Trash2, Copy, ArrowLeft, Calendar, MapPin, Users, Clock, Edit } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api';

interface Event {
  id: number;
  title: string;
  description: string;
  start_at: string;
  end_at?: string;
  location?: string;
  created_by: number;
  creator?: {
    full_name: string;
  };
  rsvps_count: number;
  status?: string;
}

const VENUES = [
  { id: 1, name: 'Tagoloan Convention Center', capacity: 500 },
  { id: 2, name: 'SMX Convention Center', capacity: 1000 },
  { id: 3, name: 'Luxury Garden Resort', capacity: 300 },
  { id: 4, name: 'Private Residence', capacity: 150 },
  { id: 5, name: 'Custom Venue', capacity: 0 }
];

const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding', icon: '💒' },
  { id: 'birthday', name: 'Birthday', icon: '🎂' },
  { id: 'corporate', name: 'Corporate', icon: '💼' },
  { id: 'anniversary', name: 'Anniversary', icon: '💝' },
  { id: 'other', name: 'Other', icon: '🎉' }
];

export default function AdminEditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    venue: null as any,
    eventType: ""
  });

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await api.get(`/events/${eventId}`);
        setEvent(eventData.data);

        // Parse the date and time from start_at
        const startDate = new Date(eventData.data.start_at);
        const endDate = eventData.data.end_at ? new Date(eventData.data.end_at) : null;

        setFormData({
          title: eventData.data.title,
          description: eventData.data.description || "",
          eventDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endTime: endDate ? endDate.toTimeString().slice(0, 5) : "",
          location: eventData.data.location || "",
          venue: VENUES.find(v => v.name === eventData.data.location) || null,
          eventType: "corporate" // Default, could be enhanced to detect from title
        });
      } catch (error) {
        console.error("Error loading event:", error);
        toast.error("Failed to load event");
        navigate("/admin/events");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVenueSelect = (venue: any) => {
    setFormData(prev => ({
      ...prev,
      venue: venue,
      location: venue.name
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        start_at: `${formData.eventDate}T${formData.startTime}:00`,
        end_at: formData.endTime ? `${formData.eventDate}T${formData.endTime}:00` : null,
        location: formData.location,
      };

      await api.put(`/events/${eventId}`, eventData);
      toast.success("Event updated successfully!");
      navigate("/admin/events");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await api.delete(`/events/${eventId}`);
        toast.success("Event deleted successfully!");
        navigate("/admin/events");
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const handleDuplicate = () => {
    // Create a copy with "Copy" suffix
    const duplicatedData = {
      ...formData,
      title: `${formData.title} (Copy)`
    };
    setFormData(duplicatedData);
    toast.success("Event duplicated! Make changes and save as new event.");
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b885] mx-auto"></div>
          <p className="mt-4 text-[#3b2a13]">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/events")}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#3b2a13]" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-[#3b2a13]">EDIT EVENT</h2>
              <p className="text-sm text-[#3b2a13]">Update event details and settings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDuplicate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#3b2a13] text-white rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Event Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                placeholder="Describe your event"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Venue *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {VENUES.map(venue => (
                  <button
                    key={venue.id}
                    type="button"
                    onClick={() => handleVenueSelect(venue)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.venue?.id === venue.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                      <MapPin className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-sm text-gray-600">
                      Capacity: {venue.capacity > 0 ? `${venue.capacity} guests` : 'Custom'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Location (if different from venue)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                placeholder="Enter specific location details"
              />
            </div>

            {/* Event Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Event Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formData.eventDate ? new Date(formData.eventDate).toLocaleDateString() : "No date set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{formData.startTime || "No time set"}{formData.endTime ? ` - ${formData.endTime}` : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{formData.location || "No location set"}</span>
                </div>
                {event && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{event.rsvps_count} RSVPs</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
