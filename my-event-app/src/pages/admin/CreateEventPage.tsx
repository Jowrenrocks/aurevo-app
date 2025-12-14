import { useState } from 'react';
import { Calendar, Users, MapPin, DollarSign, Clock, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../utils/api';

interface StepIndicatorProps {
  currentStep: number;
}

interface FormData {
  eventType: string;
  eventName: string;
  description: string;
  venue: { id: number; name: string; capacity: number } | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  expectedGuests: string;
}

interface StepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

interface ReviewStepProps {
  formData: FormData;
}

const STEPS = [
  { id: 1, title: 'Basic Info', icon: FileText },
  { id: 2, title: 'Details', icon: Calendar },
  { id: 3, title: 'Review', icon: CheckCircle }
];

const VENUES = [
  { id: 1, name: 'Tagoloan Convention Center', capacity: 500 },
  { id: 2, name: 'SMX Convention Center', capacity: 1000 },
  { id: 3, name: 'Luxury Garden Resort', capacity: 300 },
  { id: 4, name: 'Private Residence', capacity: 150 },
  { id: 5, name: 'Custom Venue', capacity: 0 }
];

const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding', icon: '💒', color: 'from-pink-400 to-rose-500' },
  { id: 'birthday', name: 'Birthday', icon: '🎂', color: 'from-blue-400 to-cyan-500' },
  { id: 'corporate', name: 'Corporate', icon: '💼', color: 'from-gray-600 to-gray-700' },
  { id: 'anniversary', name: 'Anniversary', icon: '💝', color: 'from-purple-400 to-pink-500' },
  { id: 'other', name: 'Other', icon: '🎉', color: 'from-amber-400 to-orange-500' }
];

function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-12">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} className="flex flex-col items-center">
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
        );
      })}
    </div>
  );
}

function Step1BasicInfo({ formData, updateFormData }: StepProps) {
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
          placeholder="e.g., Corporate Gala 2025"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe the event..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          required
        />
      </div>
    </div>
  );
}

function Step2Details({ formData, updateFormData }: StepProps) {
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
    </div>
  );
}

function Step3Review({ formData }: ReviewStepProps) {
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
        <h3 className="font-bold text-lg mb-4">Description</h3>
        <p className="text-sm text-gray-600">{formData.description}</p>
      </div>
    </div>
  );
}

export default function AdminCreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    eventType: '',
    eventName: '',
    description: '',
    venue: null,
    eventDate: '',
    startTime: '',
    endTime: '',
    expectedGuests: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.eventType && formData.eventName && formData.description;
      case 2:
        return formData.venue && formData.eventDate && formData.startTime &&
               formData.endTime && formData.expectedGuests;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      setLoading(true);
      try {
        const eventData = {
          title: formData.eventName,
          description: formData.description,
          start_at: `${formData.eventDate}T${formData.startTime}:00`,
          end_at: formData.endTime ? `${formData.eventDate}T${formData.endTime}:00` : null,
          location: formData.venue ? formData.venue.name : null,
        };

        await api.post('/events', eventData);
        setSubmitted(true);

        setTimeout(() => {
          navigate('/admin/events');
        }, 2000);

      } catch (error) {
        console.error('Error creating event:', error);
        toast.error('Failed to create event. Please try again.');
      } finally {
        setLoading(false);
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
            The event has been created and is now available for management.
          </p>
          <div className="inline-block px-6 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            Redirecting to events...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600">Set up a new event for management</p>
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
            <Step3Review formData={formData} />
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
            {currentStep < 3 ? (
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
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
