import { useState, useEffect } from "react";
import { Bell, Mail, MessageSquare, Smartphone, Send, Plus, CheckCircle, Clock, FileText, Eye } from "lucide-react";
import api from '../../utils/api';

interface Notification {
  id: number;
  type: "email" | "sms" | "push";
  title: string;
  message: string;
  status: "sent" | "scheduled" | "draft";
  recipientCount: number;
  eventTitle: string;
  scheduledDate?: string;
  sentDate?: string;
}

export default function UserNotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeForm, setComposeForm] = useState({
    type: "email" as "email" | "sms" | "push",
    title: "",
    message: "",
    eventId: "",
    sendToAll: true,
    recipientEmails: ""
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Mock data - replace with API calls
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: "email",
        title: "Event Reminder: Corporate Gala 2025",
        message: "Don't forget about the upcoming Corporate Gala 2025. We look forward to seeing you there!",
        status: "sent",
        recipientCount: 150,
        eventTitle: "Corporate Gala 2025",
        sentDate: "2025-11-20T10:00:00Z"
      },
      {
        id: 2,
        type: "sms",
        title: "RSVP Confirmation",
        message: "Your RSVP for Wedding - Smith & Jones has been confirmed. See you there!",
        status: "sent",
        recipientCount: 1,
        eventTitle: "Wedding - Smith & Jones",
        sentDate: "2025-11-19T14:30:00Z"
      },
      {
        id: 3,
        type: "push",
        title: "Event Update: Birthday Celebration",
        message: "Venue change: The birthday celebration will now be held at Grand Ballroom.",
        status: "scheduled",
        recipientCount: 75,
        eventTitle: "Birthday Celebration",
        scheduledDate: "2025-11-25T09:00:00Z"
      },
      {
        id: 4,
        type: "email",
        title: "Thank You Message",
        message: "Thank you for attending our recent conference. We hope to see you again!",
        status: "draft",
        recipientCount: 200,
        eventTitle: "Tech Conference 2025",
        sentDate: undefined
      },
      {
        id: 5,
        type: "sms",
        title: "Last Call Reminder",
        message: "Final reminder: Corporate Gala 2025 starts in 2 hours. Don't be late!",
        status: "scheduled",
        recipientCount: 120,
        eventTitle: "Corporate Gala 2025",
        scheduledDate: "2025-12-15T17:00:00Z"
      }
    ];

    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(n => n.status === activeTab));
    }
  }, [notifications, activeTab]);

  const getTypeIcon = (type: string) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      push: <Smartphone className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons];
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: "bg-green-100 text-green-800 border-green-300",
      scheduled: "bg-blue-100 text-blue-800 border-blue-300",
      draft: "bg-gray-100 text-gray-800 border-gray-300"
    };

    const icons = {
      sent: <CheckCircle className="w-3 h-3" />,
      scheduled: <Clock className="w-3 h-3" />,
      draft: <FileText className="w-3 h-3" />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSendReminder = async () => {
    try {
      await api.post('/notifications/send-reminder', {
        message: "Reminder: Don't forget about your upcoming event!",
        type: "email"
      });
      alert("Reminder sent to all attendees!");
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert("Failed to send reminder. Please try again.");
    }
  };

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const notificationData = {
        type: composeForm.type,
        title: composeForm.title,
        message: composeForm.message,
        eventId: composeForm.eventId || null,
        sendToAll: composeForm.sendToAll,
        recipientEmails: composeForm.sendToAll ? null : composeForm.recipientEmails.split(',').map(email => email.trim())
      };

      await api.post('/notifications', notificationData);

      // Add to notifications list
      const newNotification: Notification = {
        id: Date.now(), // Temporary ID
        type: composeForm.type,
        title: composeForm.title,
        message: composeForm.message,
        status: "sent",
        recipientCount: composeForm.sendToAll ? 150 : (composeForm.recipientEmails.split(',').length || 1),
        eventTitle: "Custom Notification",
        sentDate: new Date().toISOString()
      };

      setNotifications(prev => [newNotification, ...prev]);
      setShowComposeModal(false);
      setComposeForm({
        type: "email",
        title: "",
        message: "",
        eventId: "",
        sendToAll: true,
        recipientEmails: ""
      });

      alert("Notification sent successfully!");
    } catch (error) {
      console.error('Error sending notification:', error);
      alert("Failed to send notification. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === "sent").length,
    scheduled: notifications.filter(n => n.status === "scheduled").length,
    drafts: notifications.filter(n => n.status === "draft").length
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b885] mx-auto"></div>
          <p className="mt-4 text-[#3b2a13]">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3b2a13]">NOTIFICATIONS</h2>
            <p className="text-sm text-[#3b2a13]">Send reminders and announcements to your attendees</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSendReminder}
              className="px-6 py-3 bg-[#3b2a13] text-white rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Reminder to All
            </button>
            <button
              onClick={() => setShowComposeModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Compose New
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <Bell className="w-6 h-6 mx-auto mb-2 text-[#d4b885]" />
          <p className="text-2xl font-bold text-[#3b2a13]">{stats.total}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-md text-center border border-green-200">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
          <p className="text-xs text-gray-600">Sent</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow-md text-center border border-blue-200">
          <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
          <p className="text-xs text-gray-600">Scheduled</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl shadow-md text-center border border-gray-200">
          <FileText className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
          <p className="text-xs text-gray-600">Drafts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          {[
            { key: "all", label: "All Notifications" },
            { key: "sent", label: "Sent" },
            { key: "scheduled", label: "Scheduled" },
            { key: "draft", label: "Drafts" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-[#d4b885] border-b-2 border-[#d4b885]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      <span className="text-sm font-medium text-gray-900 capitalize">{notification.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{notification.message}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.eventTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.recipientCount} recipients
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(notification.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.sentDate
                      ? new Date(notification.sentDate).toLocaleDateString()
                      : notification.scheduledDate
                      ? new Date(notification.scheduledDate).toLocaleDateString()
                      : "Not set"
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-[#d4b885] hover:text-[#b8946a] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">Try adjusting your filter or create a new notification</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Compose New Notification</h3>
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleComposeSubmit} className="space-y-6">
                {/* Notification Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Notification Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "email", label: "Email", icon: Mail },
                      { value: "sms", label: "SMS", icon: MessageSquare },
                      { value: "push", label: "Push", icon: Smartphone }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setComposeForm(prev => ({ ...prev, type: value as any }))}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                          composeForm.type === value
                            ? "border-[#d4b885] bg-[#d4b885]/10 text-[#d4b885]"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notification Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={composeForm.title}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter notification title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={composeForm.message}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter your notification message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent resize-none"
                  />
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Recipients <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="sendToAll"
                        name="recipients"
                        checked={composeForm.sendToAll}
                        onChange={() => setComposeForm(prev => ({ ...prev, sendToAll: true }))}
                        className="w-4 h-4 text-[#d4b885] focus:ring-[#d4b885]"
                      />
                      <label htmlFor="sendToAll" className="text-sm text-gray-700">
                        Send to all attendees
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="sendToSpecific"
                        name="recipients"
                        checked={!composeForm.sendToAll}
                        onChange={() => setComposeForm(prev => ({ ...prev, sendToAll: false }))}
                        className="w-4 h-4 text-[#d4b885] focus:ring-[#d4b885]"
                      />
                      <label htmlFor="sendToSpecific" className="text-sm text-gray-700">
                        Send to specific emails
                      </label>
                    </div>
                    {!composeForm.sendToAll && (
                      <textarea
                        value={composeForm.recipientEmails}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, recipientEmails: e.target.value }))}
                        placeholder="Enter email addresses separated by commas"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent resize-none"
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowComposeModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 px-6 py-3 bg-[#d4b885] text-[#3b2a13] rounded-lg hover:bg-[#c4b184] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3b2a13]"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Notification
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
