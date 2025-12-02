import { useState } from 'react';
import { Calendar, Users, MapPin, DollarSign, Clock, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // For redirect after success
import toast, { Toaster } from 'react-hot-toast'; // Added for notifications
import dashboardBg from "../../assets/dashboard-bg.png";
import api from '../../utils/api'; // Import the API utility

const STEPS = [
  { id: 1, title: 'Basic Info', icon: FileText },
  { id: 2, title: 'Details', icon: Calendar },
  { id: 3, title: 'Services Needed', icon: Users },
  { id: 4, title: 'Review', icon: CheckCircle }
];

const VENUES = [
  { id: 1, name: 'Tagoloan Convention Center', capacity: 500 },
  { id: 2, name: 'SMX Convention Center', capacity: 1000 },
  { id: 3, name: 'Luxury Garden Resort', capacity: 300 },
  { id: 4, name: 'Private Residence', capacity: 150 },
  { id: 5, name: 'Custom Venue', capacity: 0 }
];

const SERVICES = [
  { id: 1, name: 'Catering', icon: '🍽️' },
  { id: 2, name: 'Photography', icon: '📷' },
  { id: 3, name: 'Videography', icon: '🎥' },
  { id: 4, name: 'DJ/Entertainment', icon: '🎵' },
  { id: 5, name: 'Decorations', icon: '🎨' },
  { id: 6, name: 'Event Coordinator', icon: '👔' },
  { id: 7, name: 'Sound System', icon: '🔊' },
  { id: 8, name: 'Lighting', icon: '💡' }
];

const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding', icon: '💒', color: 'from-pink-400 to-rose-500' },
  { id: 'birthday', name: 'Birthday', icon: '🎂', color: 'from-blue-400 to-cyan-500' },
  { id: 'corporate', name: 'Corporate', icon: '💼', color: 'from-gray-600 to-gray-700' },
  { id: 'anniversary', name: 'Anniversary', icon: '💝', color: 'from-purple-400 to-pink-500' },
  { id: 'other', name: 'Other', icon: '🎉', color: 'from-amber-400 to-orange-500' }
];

const API_BASE = 'http://localhost:8000/api'; // Adjust to your Laravel API URL

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-12">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isCompleted ? 'bg-green-500' : isCurrent ? 'bg-amber-500' : 'bg-gray-300'
              }`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs mt-2 font-medium ${
                isCurrent ? 'text-amber-600' : 'text-gray-600'
              }`}>
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`w-24 h-1 mx-2 transition-all ${
                isCompleted ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1BasicInfo({ formData, updateFormData }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Event Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Type *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {EVENT_TYPES.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => updateFormData('eventType', type.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.eventType === type.id
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Name *
        </label>
        <input
          type="text"
          value={formData.eventName}
          onChange={(e) => updateFormData('eventName', e.target.value)}
          placeholder="e.g., John & Jane's Wedding"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Host Name *
          </label>
          <input
            type="text"
            value={formData.hostName}
            onChange={(e) => updateFormData('hostName', e.target.value)}
            placeholder="Your name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number *
          </label>
          <input
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => updateFormData('contactNumber', e.target.value)}
            placeholder="+63 XXX XXX XXXX"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  );
}

function Step2Details({ formData, updateFormData }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Venue *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VENUES.map(venue => (
            <button
              key={venue.id}
              type="button"
              onClick={() => updateFormData('venue', venue)}
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
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Capacity: {venue.capacity > 0 ? `${venue.capacity} guests` : 'Custom'}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Date *
          </label>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) => updateFormData('eventDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Guests *
          </label>
          <input
            type="number"
            value={formData.expectedGuests}
            onChange={(e) => updateFormData('expectedGuests', e.target.value)}
            placeholder="Number of guests"
            min="1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => updateFormData('startTime', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time *
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => updateFormData('endTime', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests / Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          placeholder="Any special requirements or notes..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}

function Step3Services({ formData, updateFormData }) {
  const toggleService = (service) => {
    const services = formData.services || [];
    const exists = services.find(s => s.id === service.id);
    
    if (exists) {
      updateFormData('services', services.filter(s => s.id !== service.id));
    } else {
      updateFormData('services', [...services, service]);
    }
  };

  const isSelected = (serviceId) => {
    return (formData.services || []).some(s => s.id === serviceId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Services Needed</h2>
      <p className="text-gray-600 mb-4">
        Select the services you'll be arranging for your event. This helps track your event requirements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map(service => {
          const selected = isSelected(service.id);
          
          return (
            <div
              key={service.id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selected ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleService(service)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{service.icon}</span>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                </div>
                <button
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected
                      ? 'bg-amber-500 border-amber-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selected && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> You'll be responsible for contacting and paying these service providers directly. 
          This list is just to help you track what you need for your event.
        </p>
      </div>
    </div>
  );
}

function Step4Review({ formData }) {
  const eventType = EVENT_TYPES.find(t => t.id === formData.eventType);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Event</h2>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{eventType?.icon}</span>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{formData.eventName}</h3>
            <p className="text-gray-600">{eventType?.name} Event</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-gray-600">Date</p>
              <p className="font-medium">{formData.eventDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-gray-600">Time</p>
              <p className="font-medium">{formData.startTime} - {formData.endTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-gray-600">Venue</p>
              <p className="font-medium">{formData.venue?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-gray-600">Expected Guests</p>
              <p className="font-medium">{formData.expectedGuests} people</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Contact Information</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Host:</span> {formData.hostName}</p>
          <p><span className="font-medium">Phone:</span> {formData.contactNumber}</p>
        </div>
      </div>

      {formData.services && formData.services.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4">Services You're Arranging</h3>
          <div className="flex flex-wrap gap-2">
            {formData.services.map(service => (
              <span key={service.id} className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <span>{service.icon}</span>
                {service.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Remember: You'll need to contact and book these services separately.
          </p>
        </div>
      )}

      {formData.notes && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-2">Special Notes</h3>
          <p className="text-sm text-gray-600">{formData.notes}</p>
        </div>
      )}
    </div>
  );
}

export default function EventCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: '',
    eventName: '',
    hostName: '',
    contactNumber: '',
    venue: null,
    eventDate: '',
    startTime: '',
    endTime: '',
    expectedGuests: '',
    notes: '',
    services: []
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.eventType && formData.eventName && formData.hostName && 
               formData.contactNumber;
      case 2:
        return formData.venue && formData.eventDate && formData.startTime && 
               formData.endTime && formData.expectedGuests;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        // Transform form data to match API expectations
        const eventData = {
          title: formData.eventName,
          description: formData.notes || null,
          start_at: `${formData.eventDate}T${formData.startTime}:00`,
          end_at: formData.endTime ? `${formData.eventDate}T${formData.endTime}:00` : null,
          location: formData.venue?.name || null,
          expected_guests: parseInt(formData.expectedGuests),
          event_type: formData.eventType,
          host_name: formData.hostName,
          contact_number: formData.contactNumber,
          services: formData.services || []
        };

        console.log('Submitting event data:', eventData);

        // Make API call to create event
        await api.post('/events', eventData);

        setSubmitted(true);

        // Redirect to view events page after success
        setTimeout(() => {
          navigate('/user/view-events');
        }, 2000);

      } catch (error) {
        console.error('Error creating event:', error);
        toast.error('Failed to create event. Please try again.');
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Created Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your event has been created. View at your View Events to clarify.
          </p>
          <div className="inline-block px-6 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
    className="min-h-screen bg-cover bg-center p-6"
    style={{ backgroundImage: `url(${dashboardBg})` }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Event</h1>
          <p className="text-gray-600">Let's plan something amazing together</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {currentStep === 1 && (
            <Step1BasicInfo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <Step2Details formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <Step3Services formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <Step4Review formData={formData} />
          )}
        </div>

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}

          <div className="ml-auto">
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!validateStep()}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}