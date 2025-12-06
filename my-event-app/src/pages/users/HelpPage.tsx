import { useState } from 'react';
import { HelpCircle, MessageCircle, Mail, Phone, Search, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../utils/api';

const faqs = [
  {
    question: "How do I create a new event?",
    answer: "Navigate to Events > Create Event from the sidebar. Fill in all the required details including event name, type, date, time, venue, and other preferences. Click 'Create Event' to save."
  },
  {
    question: "How can I view RSVPs for my events?",
    answer: "Go to the 'RSVPs / Attendees' page from the sidebar. Select the event you want to view, and you'll see a complete list of all attendees with their RSVP status, contact information, and submission dates."
  },
  {
    question: "Can I export attendee lists?",
    answer: "Yes! On the RSVPs page, click the 'Export CSV' or 'Export PDF' button at the top right to download the attendee list in your preferred format."
  },
  {
    question: "How do I send notifications to attendees?",
    answer: "Visit the 'Notifications' page, select your event, choose the notification type (reminder or announcement), compose your message, and click 'Send Notification' to reach all attendees."
  },
  {
    question: "What reports can I generate?",
    answer: "The Reports page offers summary reports, detailed event reports, financial reports, and attendance reports. You can filter by date range and export the data in PDF, Excel, or CSV format."
  },
  {
    question: "How do I edit an existing event?",
    answer: "Go to Events > View Events, find your event in the list, and click the 'Edit' button. Make your changes and save to update the event details."
  },
  {
    question: "Can I duplicate an event?",
    answer: "Yes! On the View Events page, click the 'Duplicate' button next to any event. This will create a copy with all the same details that you can then modify as needed."
  },
  {
    question: "How do I change my password?",
    answer: "Navigate to Account Settings > Security tab. Enter your current password, then your new password twice, and click 'Update Password' to change it."
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/support/contact', contactForm);
      alert('Your message has been sent! We\'ll get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending contact form:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-1">Find answers to common questions or contact us</p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Mail className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-2">Email Support</h3>
          <p className="text-blue-100 text-sm mb-3">Get help via email</p>
          <a href="mailto:support@eventmanagement.com" className="text-sm underline">
            support@eventmanagement.com
          </a>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Phone className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-2">Phone Support</h3>
          <p className="text-green-100 text-sm mb-3">Mon-Fri, 9AM-5PM</p>
          <a href="tel:+639123456789" className="text-sm underline">
            +63 912 345 6789
          </a>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <MessageCircle className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-2">Live Chat</h3>
          <p className="text-purple-100 text-sm mb-3">Chat with our team</p>
          <button className="text-sm underline">Start Chat</button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {expandedFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {expandedFAQ === index && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No FAQs found matching your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
        </div>

        <form onSubmit={handleSubmitContact} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={contactForm.subject}
              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
              placeholder="How can we help you?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              rows={6}
              placeholder="Describe your issue or question in detail..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Send Message
          </button>
        </form>
      </div>

      {/* Documentation Links */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">User Guide</p>
              <p className="text-sm text-gray-600">Complete documentation</p>
            </div>
          </a>

          <a href="#" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Video Tutorials</p>
              <p className="text-sm text-gray-600">Learn with videos</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}