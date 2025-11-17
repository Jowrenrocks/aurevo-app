import api from '../utils/api';

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    return [
      { id: 1, title: "Corporate Gala 2025", date: "2025-12-15", attendees: 250, status: "upcoming", revenue: 125000, type: "corporate", rsvps_count: 250 },
      { id: 2, title: "Wedding - Smith & Jones", date: "2025-11-28", attendees: 150, status: "upcoming", revenue: 85000, type: "wedding", rsvps_count: 150 },
      { id: 3, title: "Birthday Celebration", date: "2025-11-20", attendees: 80, status: "upcoming", revenue: 35000, type: "birthday", rsvps_count: 80 },
      { id: 4, title: "Anniversary Party", date: "2025-10-15", attendees: 100, status: "completed", revenue: 45000, type: "anniversary", rsvps_count: 100 },
      { id: 5, title: "Tech Conference 2025", date: "2025-12-01", attendees: 500, status: "upcoming", revenue: 250000, type: "corporate", rsvps_count: 500 },
    ]
    },

  // Get single event
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  createEvent: async (eventData) => {
    const response = await api.post('/events', {
      title: eventData.eventName,
      description: eventData.notes || '',
      start_at: `${eventData.eventDate} ${eventData.startTime}`,
      end_at: `${eventData.eventDate} ${eventData.endTime}`,
      location: eventData.venue?.name || '',
      status: 'pending'
    });
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Get event attendees
  getAttendees: async (id) => {
    const response = await api.get(`/events/${id}/attendees`);
    return response.data;
  },

  // RSVP to event
  rsvp: async (eventId, response) => {
    const res = await api.post(`/events/${eventId}/rsvp`, { response });
    return res.data;
  }
};