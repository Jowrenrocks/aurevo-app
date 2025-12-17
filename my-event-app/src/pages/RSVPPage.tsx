import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import api from "../utils/api";
import bg from "../assets/rsvp-bg.png";

interface GuestInfo {
  fullName: string;
  phone: string;
  response: 'yes' | 'no' | 'maybe' | '';
  reasonForDeclining: string;
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
    phone: "",
    response: '',
    reasonForDeclining: "",
    dietaryRestrictions: "",
    message: ""
  });

  // Fetch actual event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}/public`);
        const eventData = response.data;

        // Format the data for display
        const formattedEvent = {
          id: eventData.id,
          title: eventData.title,
          date: new Date(eventData.start_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          time: new Date(eventData.start_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          venue: eventData.location || 'Location TBD',
          venueAddress: 'Venue Address',
          theme: 'Event Theme',
          hosts: eventData.creator?.full_name || 'Event Organizer',
          description: eventData.description,
          backgroundImage: bg
        };

        setEvent(formattedEvent);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        // Fallback to mock data if API fails
        const mockEvent = {
          id: eventId,
          title: "Event Not Found",
          date: "N/A",
          time: "N/A",
          venue: "N/A",
          venueAddress: "N/A",
          theme: "N/A",
          hosts: "N/A",
          description: "This event could not be loaded.",
          backgroundImage: bg
        };
        setEvent(mockEvent);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResponseChange = (response: 'yes' | 'no' | 'maybe') => {
    setGuestInfo(prev => ({
      ...prev,
      response,
      // Clear reason if not declining
      reasonForDeclining: response === 'no' ? prev.reasonForDeclining : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!guestInfo.response) {
      alert('Please select your response (Yes, No, or Maybe)');
      return;
    }

    if (guestInfo.response === 'no' && !guestInfo.reasonForDeclining.trim()) {
      alert('Please provide a reason for declining');
      return;
    }

    try {
      // Prepare special requests based on response
      let specialRequests = '';
      
      if (guestInfo.response === 'no') {
        specialRequests = `Reason for declining: ${guestInfo.reasonForDeclining}`;
      } else {
        const parts = [];
        if (guestInfo.dietaryRestrictions) {
          parts.push(`Dietary: ${guestInfo.dietaryRestrictions}`);
        }
        if (guestInfo.message) {
          parts.push(guestInfo.message);
        }
        specialRequests = parts.join('. ');
      }

      // Generate a simple email from phone number (since email is removed)
      const generatedEmail = `${guestInfo.phone.replace(/[^0-9]/g, '')}@guest.rsvp`;

      await api.post(`/events/${eventId}/rsvp-guest`, {
        name: guestInfo.fullName,
        email: generatedEmail, // Backend still needs email for unique constraint
        phone: guestInfo.phone,
        status: guestInfo.response,
        guests: 1, // Default to 1 since we removed the number field
        reason_for_declining: guestInfo.response === 'no' ? guestInfo.reasonForDeclining : null,
        special_requests: specialRequests || null
      });
      
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
    const responseMessages = {
      yes: {
        title: "RSVP Confirmed!",
        message: `Thank you, ${guestInfo.fullName}! Your RSVP has been received.`,
        emoji: "🎉"
      },
      no: {
        title: "Response Received",
        message: `Thank you for letting us know, ${guestInfo.fullName}. We're sorry you can't make it.`,
        emoji: "😔"
      },
      maybe: {
        title: "Response Received",
        message: `Thank you, ${guestInfo.fullName}! We've noted that you might attend. Please confirm when you can.`,
        emoji: "🤔"
      }
    };

    const responseInfo = responseMessages[guestInfo.response as 'yes' | 'no' | 'maybe'];

    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 shadow-2xl text-center max-w-xl">
          <div className={`w-20 h-20 ${guestInfo.response === 'yes' ? 'bg-green-500' : guestInfo.response === 'no' ? 'bg-red-500' : 'bg-yellow-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {guestInfo.response === 'yes' && <CheckCircle className="w-12 h-12 text-white" />}
            {guestInfo.response === 'no' && <XCircle className="w-12 h-12 text-white" />}
            {guestInfo.response === 'maybe' && <HelpCircle className="w-12 h-12 text-white" />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{responseInfo.title}</h2>
          <p className="text-lg text-gray-700 mb-6">
            {responseInfo.message}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              We have your contact number <strong>{guestInfo.phone}</strong> on file
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
              {/* Response Selection - YES/NO/MAYBE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Will you attend? *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleResponseChange('yes')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      guestInfo.response === 'yes'
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <CheckCircle className={`w-10 h-10 mx-auto mb-3 ${
                      guestInfo.response === 'yes' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <div className="text-center font-bold text-lg mb-1">Yes</div>
                    <div className="text-xs text-gray-600 text-center">I'll be there!</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResponseChange('no')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      guestInfo.response === 'no'
                        ? 'border-red-500 bg-red-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <XCircle className={`w-10 h-10 mx-auto mb-3 ${
                      guestInfo.response === 'no' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <div className="text-center font-bold text-lg mb-1">No</div>
                    <div className="text-xs text-gray-600 text-center">Can't make it</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResponseChange('maybe')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      guestInfo.response === 'maybe'
                        ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <HelpCircle className={`w-10 h-10 mx-auto mb-3 ${
                      guestInfo.response === 'maybe' ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                    <div className="text-center font-bold text-lg mb-1">Maybe</div>
                    <div className="text-xs text-gray-600 text-center">Not sure yet</div>
                  </button>
                </div>
              </div>

              {/* Reason for Declining - Only show if response is "no" */}
              {guestInfo.response === 'no' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Please tell us why you can't attend *
                  </label>
                  <textarea
                    name="reasonForDeclining"
                    value={guestInfo.reasonForDeclining}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Let us know why you can't make it..."
                    required={guestInfo.response === 'no'}
                  />
                  <p className="text-xs text-red-600 mt-2">
                    This helps us plan better for future events
                  </p>
                </div>
              )}

              {/* Contact Information */}
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
              </div>

              {/* Additional Info - Only show if response is "yes" or "maybe" */}
              {(guestInfo.response === 'yes' || guestInfo.response === 'maybe') && (
                <>
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
                </>
              )}

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
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                    guestInfo.response === 'yes'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : guestInfo.response === 'no'
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600'
                      : guestInfo.response === 'maybe'
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                  } text-white`}
                  disabled={!guestInfo.response}
                >
                  {guestInfo.response === 'yes' && '✓ Confirm Attendance'}
                  {guestInfo.response === 'no' && '✗ Submit Response'}
                  {guestInfo.response === 'maybe' && '? Submit Response'}
                  {!guestInfo.response && 'Select Response First'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}