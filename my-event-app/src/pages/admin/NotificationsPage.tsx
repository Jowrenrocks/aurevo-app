import { useState, useEffect } from "react";
import { Bell, Send, Clock, CheckCircle, AlertCircle, Mail, MessageSquare, Calendar, Users } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "email" | "sms" | "push";
  status: "sent" | "scheduled" | "draft";
  recipientCount: number;
  sentAt?: string;
  scheduledFor?: string;
  eventId?: number;
  eventTitle?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "scheduled" | "draft">("all");
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    // Mock data - replace with API calls
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "Event Reminder: Corporate Gala 2025",
        message: "Don't forget about the Corporate Gala 2025 happening this Saturday at Tagoloan Convention Center. We look forward to seeing you there!",
        type: "email",
        status: "sent",
        recipientCount: 250,
        sentAt: "2025-11-15T10:00:00Z",
        eventId: 1,
        eventTitle: "Corporate Gala 2025"
      },
      {
        id: 2,
        title: "RSVP Confirmation",
        message: "Thank you for RSVPing to the Wedding Reception. Your response has been recorded.",
        type: "email",
        status: "sent",
        recipientCount: 150,
        sentAt: "2025-11-14T14:30:00Z",
        eventId: 2,
        eventTitle: "Wedding - Smith & Jones"
      },
      {
        id: 3,
        title: "Last Call: Birthday Celebration",
        message: "Final reminder: Birthday Celebration tomorrow at Private Residence. Please confirm your attendance.",
        type: "sms",
        status: "scheduled",
        recipientCount: 80,
        scheduledFor: "2025-11-19T18:00:00Z",
        eventId: 3,
        eventTitle: "Birthday Celebration"
      },
      {
        id: 4,
        title: "Welcome to Event Management System",
        message: "Welcome! Your account has been created successfully. Start planning your next event today.",
        type: "email",
        status: "draft",
        recipientCount: 1
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    return notification.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: "bg-green-100 text-green-800 border-green-300",
      scheduled: "bg-blue-100 text-blue-800 border-blue-300",
      draft: "bg-gray-100 text-gray-800 border-gray-300"
    };

    const icons = {
      sent: <CheckCircle className="w-3 h-3" />,
      scheduled: <Clock className="w-3 h-3" />,
      draft: <AlertCircle className="w-3 h-3" />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      push: <Bell className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Bell className="w-4 h-4" />;
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === "sent").length,
    scheduled: notifications.filter(n => n.status === "scheduled").length,
    draft: notifications.filter(n => n.status === "draft").length
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
            <p className="text-sm text-[#3b2a13]">Manage and send notifications to attendees</p>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="px-6 py-3 bg-[#3b2a13] text-white rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Compose New
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <Bell className="w-6 h-6 mx-auto mb-2 text-[#d4b885]" />
          <p className="text-2xl font-bold text-[#3b2a13]">{stats.total}</p>
          <p className="text-xs text-gray-600">Total Notifications</p>
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
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
          <p className="text-xs text-gray-600">Drafts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex gap-4 mb-6">
          {[
            { key: "all", label: "All Notifications", count: stats.total },
            { key: "sent", label: "Sent", count: stats.sent },
            { key: "scheduled", label: "Scheduled", count: stats.scheduled },
            { key: "draft", label: "Drafts", count: stats.draft }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-[#d4b885] text-[#3b2a13] shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
              <span className="bg-white/50 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(notification.type)}
                    <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                    {getStatusBadge(notification.status)}
                  </div>

                  <p className="text-gray-600 mb-3">{notification.message}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {notification.recipientCount} recipients
                    </div>
                    {notification.eventTitle && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {notification.eventTitle}
                      </div>
                    )}
                    {notification.sentAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Sent {new Date(notification.sentAt).toLocaleString()}
                      </div>
                    )}
                    {notification.scheduledFor && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Scheduled for {new Date(notification.scheduledFor).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {notification.status === "draft" && (
                    <>
                      <button className="px-3 py-1 bg-[#d4b885] text-[#3b2a13] rounded-lg text-sm font-medium hover:bg-[#c4b184] transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        Send Now
                      </button>
                    </>
                  )}
                  {notification.status === "scheduled" && (
                    <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try switching to a different tab or create a new notification</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal Placeholder */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4">Compose New Notification</h3>
            <p className="text-gray-600 mb-4">This feature would allow composing and sending notifications to attendees.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 bg-[#d4b885] text-[#3b2a13] rounded-lg hover:bg-[#c4b184]"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
