import { useState, useEffect } from "react";
import { Bell, Mail, MessageSquare, Smartphone, Send, Plus, CheckCircle, Clock, FileText, Eye, Trash2, RefreshCw, Loader2 } from "lucide-react";
import api from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

interface Notification {
  id: number;
  type: "email" | "sms" | "push";
  title: string;
  message: string;
  status: "sent" | "scheduled" | "draft" | "failed";
  recipientCount: number;
  eventTitle: string;
  scheduledDate?: string;
  sentDate?: string;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
}

export default function UserNotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
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
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    scheduled: 0,
    draft: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(n => n.status === activeTab));
    }
  }, [notifications, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load notifications
      const notificationsResponse = await api.get('/notifications');
      setNotifications(notificationsResponse.data);
      setFilteredNotifications(notificationsResponse.data);
      
      // Load stats
      const statsResponse = await api.get('/notifications/stats');
      setStats(statsResponse.data);
      
      // Load user's events for compose modal
      const eventsResponse = await api.get('/events');
      setEvents(eventsResponse.data);
      
    } catch (error: any) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.promise(
      loadData(),
      {
        loading: 'Refreshing...',
        success: 'Notifications refreshed',
        error: 'Failed to refresh'
      }
    );
  };

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
      draft: "bg-gray-100 text-gray-800 border-gray-300",
      failed: "bg-red-100 text-red-800 border-red-300"
    };

    const icons = {
      sent: <CheckCircle className="w-3 h-3" />,
      scheduled: <Clock className="w-3 h-3" />,
      draft: <FileText className="w-3 h-3" />,
      failed: <Eye className="w-3 h-3" />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSendReminder = async () => {
    const confirmed = window.confirm('Send a reminder to all your event attendees?');
    if (!confirmed) return;

    try {
      const response = await api.post('/notifications/send-reminder', {
        message: "Reminder: Don't forget about your upcoming event!",
        type: "email"
      });
      
      toast.success(response.data.message);
      loadData(); // Reload notifications
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      toast.error(error.response?.data?.message || 'Failed to send reminder');
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

      const response = await api.post('/notifications', notificationData);

      toast.success(response.data.message);
      setShowComposeModal(false);
      setComposeForm({
        type: "email",
        title: "",
        message: "",
        eventId: "",
        sendToAll: true,
        recipientEmails: ""
      });

      loadData(); // Reload notifications
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this notification?');
    if (!confirmed) return;

    try {
      await api.delete(`/notifications/${id}`);
      toast.success('Notification deleted successfully');
      loadData(); // Reload notifications
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#d4b885] mx-auto mb-4 animate-spin" />
          <p className="text-lg text-[#3b2a13] font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3b2a13]">NOTIFICATIONS</h2>
            <p className="text-sm text-[#3b2a13]">Send reminders and announcements to your attendees</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white text-[#3b2a13] rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 border-2 border-[#3b2a13]"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
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
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
          <p className="text-xs text-gray-600">Drafts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex gap-4 border-b border-gray-200 flex-wrap">
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
                      : new Date(notification.created_at).toLocaleDateString()
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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

                {/* Event Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Event (Optional)
                  </label>
                  <select
                    value={composeForm.eventId}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, eventId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                  >
                    <option value="">All Events</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to send to attendees from all your events
                  </p>
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
                        Send to all attending guests
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
                        <Loader2 className="w-4 h-4 animate-spin" />
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