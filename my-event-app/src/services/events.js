import api from '../utils/api';
export const fetchEvents = () => api.get('/events').then(r=>r.data);
export const fetchEvent = id => api.get(`/events/${id}`).then(r=>r.data);
export const createEvent = payload => api.post('/events', payload).then(r=>r.data);
export const rsvp = (id, response) => api.post(`/events/${id}/rsvp`, {response}).then(r=>r.data);
