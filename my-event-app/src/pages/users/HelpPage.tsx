import { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';

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
  },
  {
    question: "What is the venue capacity limit?",
    answer: "Each venue has a maximum capacity. When creating an event, you cannot invite more guests than the selected venue can accommodate. The expected guest count must not exceed the venue's capacity."
  },
  {
    question: "How do RSVPs work?",
    answer: "Guests receive an RSVP link for your event. They can respond with 'Yes', 'No', or 'Maybe'. If attending, they can specify dietary restrictions and special requests. All responses are tracked in your RSVP management page."
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-1">Find answers to common questions</p>
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
    </div>
  );
}