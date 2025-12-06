import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Trash2, Copy, ArrowLeft, Calendar, MapPin, Users, Clock } from "lucide-react";
import api from '../../utils/api';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  category: string;
  status: "draft" | "published" | "cancelled";
  image?: string;
}

export default function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    maxAttendees: number;
    category: string;
    status: "draft" | "published" | "cancelled";
  }>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: 0,
    category: "",
    status: "draft" as "draft" | "published" | "cancelled"
  });

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        const eventData = response.data;

        // Transform API data to match component format
        const transformedEvent: Event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          date: eventData.start_at.split('T')[0], // Extract date part
          time: eventData.start_at.split('T')[1].substring(0, 5), // Extract time part (HH:MM)
          location: eventData.location || '',
          maxAttendees: 0, // Not in API, set to 0
          category: '', // Not in API, set to empty
          status: 'published' // Not in API, assume published
        };

        setEvent(transformedEvent);
        setFormData({
          title: transformedEvent.title,
          description: transformedEvent.description,
          date: transformedEvent.date,
          time: transformedEvent.time,
          location: transformedEvent.location,
          maxAttendees: transformedEvent.maxAttendees,
          category: transformedEvent.category,
          status: transformedEvent.status
        });
      } catch (error) {
        console.error('Error loading event:', error);
        // Handle error - could show error message
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxAttendees' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Combine date and time for API
      const startAt = `${formData.date}T${formData.time}:00`;

      const updateData = {
        title: formData.title,
        description: formData.description,
        start_at: startAt,
        location: formData.location,
        // Add other fields if API supports them
      };

      await api.put(`/events/${eventId}`, updateData);
      alert("Event updated successfully!");
      navigate("/user/events");
    } catch (error) {
      console.error('Error updating event:', error);
      alert("Failed to update event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await api.delete(`/events/${eventId}`);
        alert("Event deleted successfully!");
        navigate("/user/events");
      } catch (error) {
        console.error('Error deleting event:', error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleDuplicate = async () => {
    try {
      // First get the current event data
      const response = await api.get(`/events/${eventId}`);
      const eventData = response.data;

      // Create a duplicate with modified title
      const duplicateData = {
        ...eventData,
        title: `${eventData.title} (Copy)`,
        start_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Set to 1 week from now
      };

      await api.post('/events', duplicateData);
      alert("Event duplicated successfully!");
      navigate("/user/events");
    } catch (error) {
      console.error('Error duplicating event:', error);
      alert("Failed to duplicate event. Please try again.");
    }
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
              onClick={() => navigate("/user/events")}
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
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                placeholder="Enter event location"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Corporate">Corporate</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Conference">Conference</option>
                <option value="Social">Social</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                placeholder="Enter maximum number of attendees"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Event Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Event Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formData.date ? new Date(formData.date).toLocaleDateString() : "No date set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{formData.time || "No time set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{formData.location || "No location set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{formData.maxAttendees ? `${formData.maxAttendees} max attendees` : "No limit set"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
