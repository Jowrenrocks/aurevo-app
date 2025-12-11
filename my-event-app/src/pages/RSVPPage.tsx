import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import api from "../utils/api";
import bg from "../assets/rsvp-bg.png";

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  dietaryRestrictions: string;
  message: string;
}

export default function PublicRSVPPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    fullName: "",
    email: "",
    phone: "",
    numberOfGuests: 1,
    dietaryRestrictions: "",
    message: ""
  });

  // Mock event data - replace with API call
  useEffect(() => {
    const fetchEvent = async () => {
      // TODO: Replace with actual API call
      // const response = await api.get(`/events/${eventId}/public`);
      
      // Mock data for now
      const mockEvent = {
        id: eventId,
        title: "Wedding Reception - Smith & Jones",
        date: "December 15, 2025",
        time: "6:00 PM",
        venue: "Tagoloan Convention Center",
        venueAddress: "Napocor, Tagoloan, Misamis Oriental",
        theme: "Elegant Garden",
        hosts: "John Smith & Jane Jones",
        description: "Join us in celebrating our special day!",
        maxGuests: 2,
        backgroundImage: bg
      };
      
      setEvent(mockEvent);
      setLoading(false);
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: name === "numberOfGuests" ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post(`/events/${eventId}/rsvp`, guestInfo);
      setSubmitted(true);

      // Auto-redirect after 5 seconds
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
      alert('Failed to submit RSVP. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">This RSVP link appears to be invalid or expired.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 shadow-2xl text-center max-w-xl">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">RSVP Confirmed!</h2>
          <p className="text-lg text-gray-700 mb-2">
            Thank you, <span className="font-semibold text-amber-600">{guestInfo.fullName}</span>!
          </p>
          <p className="text-gray-600 mb-6">
            Your RSVP for <strong>{guestInfo.numberOfGuests}</strong> {guestInfo.numberOfGuests === 1 ? "guest" : "guests"} has been received.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              A confirmation email has been sent to <strong>{guestInfo.email}</strong>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to home page in 5 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className="min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Event Info Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 text-center">
              <h1 className="text-4xl font-bold mb-3">{event.title}</h1>
              <p className="text-xl">You're Invited!</p>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📅 Date & Time</h3>
                <p className="text-gray-700">{event.date}</p>
                <p className="text-gray-700">{event.time}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📍 Venue</h3>
                <p className="text-gray-700">{event.venue}</p>
                <p className="text-sm text-gray-600">{event.venueAddress}</p>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-2">💝 Hosted By</h3>
                <p className="text-gray-700">{event.hosts}</p>
              </div>
              
              {event.description && (
                <div className="md:col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-gray-700">{event.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* RSVP Form */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">RSVP Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={guestInfo.fullName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={guestInfo.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={guestInfo.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+63 XXX XXX XXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <select
                    name="numberOfGuests"
                    value={guestInfo.numberOfGuests}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    {[...Array(event.maxGuests || 5)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dietary Restrictions (Optional)
                </label>
                <input
                  type="text"
                  name="dietaryRestrictions"
                  value={guestInfo.dietaryRestrictions}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Vegetarian, Gluten-free, Allergies"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message to Hosts (Optional)
                </label>
                <textarea
                  name="message"
                  value={guestInfo.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  placeholder="Send your congratulations or special requests..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Your RSVP is important to help us prepare for the event. 
                  Please respond by at least 2 weeks before the event date.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                  Confirm RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}