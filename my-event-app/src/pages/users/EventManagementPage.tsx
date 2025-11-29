import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form"; 
import toast, { Toaster } from 'react-hot-toast';
import api, { setAuthToken } from '../../utils/api'; // Import from your api.js
import dashboardBg from "../../assets/dashboard-bg.png";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CalendarDays, Edit3, Trash2, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

// Updated to match your Laravel Event model
interface Event {
  id: number;
  title: string;
  description?: string;
  start_at: string; // Maps to 'date' in UI
  end_at?: string;
  location?: string; // Maps to 'venue' in UI
  user_id: number;
  status: "draft" | "pending" | "approved" | "declined" | "concluded";
  created_at: string;
  updated_at: string;
}

// Imported from your EventCreationWizard for venue options (maps to location)
const VENUES = [
  { id: 1, name: 'Tagoloan Convention Center', capacity: 500, price: 50000 },
  { id: 2, name: 'SMX Convention Center', capacity: 1000, price: 100000 },
  { id: 3, name: 'Luxury Garden Resort', capacity: 300, price: 75000 },
  { id: 4, name: 'Private Residence', capacity: 150, price: 30000 }
];

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Fetch events using Axios with better error handling
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      setAuthToken(token); // Set token globally for Axios

      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        // Optionally redirect: window.location.href = '/login';
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to load events. Please refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatusChange = async (id: number, newStatus: Event['status']) => {
    const loadingToast = toast.loading('Updating status...');
    try {
      const response = await api.put(`/events/${id}`, { status: newStatus });
      toast.success('Status updated successfully!');
      fetchEvents(); // Refresh list
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDelete = async (id: number) => {
    const loadingToast = toast.loading('Deleting event...');
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully!');
      fetchEvents(); // Refresh list
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchEvents();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <Toaster position="top-right" /> {/* For toast notifications */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header with Refresh Button */}
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-serif font-bold text-[#f8f4ef] drop-shadow-md"
            >
              Event Management
            </motion.h1>
            <Button
              onClick={handleRefresh}
              className="bg-[#d4b68a] hover:bg-[#c8a67a] text-[#2e2e2e] px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>

          {/* Table/Card List */}
          <Card className="bg-[#f1dfc6]/90 border border-[#c8b08b]/50 rounded-2xl shadow-xl backdrop-blur-md">
            <CardContent className="p-6 overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-[#d4b68a]/80 text-[#2e2e2e] uppercase text-xs font-semibold tracking-wide">
                    <th className="py-3 px-4 rounded-tl-lg">Event Title</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-[#d3bfa5]/40 hover:bg-[#f7ecd9]/80 transition text-[#3b2e1e]"
                    >
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        <CalendarDays size={16} className="text-[#a67c52]" />
                        {event.title}
                      </td>
                      <td className="py-3 px-4">{new Date(event.start_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{event.location || 'N/A'}</td>
                      <td className="py-3 px-4 font-semibold">
                        {event.status === "approved" && (
                          <span className="text-green-800 bg-green-200/90 px-3 py-1 rounded-full text-xs shadow-sm">
                            Approved
                          </span>
                        )}
                        {event.status === "pending" && (
                          <span className="text-yellow-800 bg-yellow-200/90 px-3 py-1 rounded-full text-xs shadow-sm">
                            Pending
                          </span>
                        )}
                        {event.status === "declined" && (
                          <span className="text-red-800 bg-red-200/90 px-3 py-1 rounded-full text-xs shadow-sm">
                            Declined
                          </span>
                        )}
                        {event.status === "draft" && (
                          <span className="text-blue-800 bg-blue-200/90 px-3 py-1 rounded-full text-xs shadow-sm">
                            Draft
                          </span>
                        )}
                        {event.status === "concluded" && (
                          <span className="text-gray-800 bg-gray-200/90 px-3 py-1 rounded-full text-xs shadow-sm">
                            Concluded
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center flex justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-700 border-blue-400 hover:bg-blue-50 hover:text-blue-900 transition"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-700 border-green-400 hover:bg-green-50 hover:text-green-900 transition"
                          onClick={() => handleStatusChange(event.id, "approved")}
                        >
                          <CheckCircle size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-700 border-red-400 hover:bg-red-50 hover:text-red-900 transition"
                          onClick={() => handleStatusChange(event.id, "declined")}
                        >
                          <XCircle size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-700 border-gray-400 hover:bg-gray-50 hover:text-gray-900 transition"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-700 border-blue-400 hover:bg-blue-50 hover:text-blue-900 transition"
                          onClick={() => {
                            const link = `${window.location.origin}/rsvp/${event.id}`;
                            navigator.clipboard.writeText(link);
                            toast.success('RSVP link copied to clipboard!');
                          }}
                        >
                          Copy RSVP Link
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Event Modal */}
      {isEditModalOpen && editingEvent && <EventFormModal event={editingEvent} onClose={() => {
        setIsEditModalOpen(false);
        setEditingEvent(null);
      }} onSubmit={async (data) => {
        const loadingToast = toast.loading('Updating event...');
        try {
          await api.put(`/events/${editingEvent.id}`, data);
          toast.success('Event updated successfully!');
          setIsEditModalOpen(false);
          setEditingEvent(null);
          fetchEvents(); // Refresh list
        } catch (error: any) {
          console.error('Error updating event:', error);
          toast.error('Failed to update event. Please try again.');
        } finally {
          toast.dismiss(loadingToast);
        }
      }} />}
    </div>
  );
}

// Reusable Modal Component for Edit
function EventFormModal({ event, onClose, onSubmit }: { event: Event; onClose: () => void; onSubmit: (data: { title: string; start_at: string; location: string }) => void }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { title: event.title, start_at: event.start_at.split('T')[0], location: event.location }
  });

  const onFormSubmit = (data: { title: string; start_at: string; location: string }) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-[#f1dfc6]/95 border border-[#c8b08b]/50 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#2e2e2e] mb-4">Edit Event</h2>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2e2e2e] mb-2">Event Title *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="w-full p-3 border border-[#c8b08b] rounded-lg focus:ring-2 focus:ring-[#d4b68a]"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2e2e2e] mb-2">Date *</label>
              <input
                {...register('start_at', { required: 'Date is required' })}
                type="date"
                className="w-full p-3 border border-[#c8b08b] rounded-lg focus:ring-2 focus:ring-[#d4b68a]"
              />
              {errors.start_at && <p className="text-red-500 text-sm">{errors.start_at.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2e2e2e] mb-2">Venue *</label>
              <select
                {...register('location', { required: 'Venue is required' })}
                className="w-full p-3 border border-[#c8b08b] rounded-lg focus:ring-2 focus:ring-[#d4b68a]"
              >
                <option value="">Select a venue</option>
                {VENUES.map(venue => (
                  <option key={venue.id} value={venue.name}>{venue.name}</option>
                ))}
              </select>
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>
            <div className="flex gap-3">
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1 bg-[#d4b68a] hover:bg-[#c8a67a] text-[#2e2e2e]">Update</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}