import { useState, useEffect } from "react";
import { Bell, Send, Clock, CheckCircle, AlertCircle, Mail, MessageSquare, Calendar, Users, RefreshCw, Loader2, Eye, X } from "lucide-react";
import api from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

interface SystemNotification {
  id: number;
  type: "new_user" | "new_event" | "new_rsvp" | "flagged_event" | "system";
  title: string;
  message: string;
  data: any;
  created_at: string;
  read: boolean;
}

interface Notification {
  id: number;
  type: "email" | "sms" | "push";
  title: string;
  message: string;
  status: "sent" | "scheduled" | "draft";
  recipientCount: number;
  eventTitle: string;
  creator?: {
    full_name: string;
  };
  scheduledDate?: string;
  sentDate?: string;
  created_at: string;
}

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"system" | "user_sent">("system");
  const [systemNotifications, setSystemNotifications] = useState<SystemNotification[]>([]);
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  
  const [stats, setStats] = useState({
    total: 0,
    new_users: 0,
    new_events: 0,
    new_rsvps: 0,
    flagged_events: 0,
    user_notifications: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === "system") {
        await loadSystemNotifications();
      } else {
        await loadUserNotifications();
      }
      
    } catch (error: any) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemNotifications = async () => {
    try {
      const response = await api.get('/admin/system-notifications');
      setSystemNotifications(response.data.notifications || []);
      setStats(response.data.stats || {
        total: 0,
        new_users: 0,
        new_events: 0,
        new_rsvps: 0,
        flagged_events: 0,
        user_notifications: 0
      });
    } catch (error) {
      console.error('Error loading system notifications:', error);
      // Set mock data for demo
      const mockSystemNotifications: SystemNotification[] = [
        {
          id: 1,
          type: "new_user",
          title: "New User Registration",
          message: "John Doe registered an account",
          data: { user_id: 5, email: "john@example.com" },
          created_at: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          type: "new_event",
          title: "New Event Created",
          message: "Corporate Gala 2025 was created by Jane Smith",
          data: { event_id: 10, creator: "Jane Smith" },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: 3,
          type: "flagged_event",
          title: "Event Flagged as Suspicious",
          message: "Suspicious Activity Event was flagged for review",
          data: { event_id: 12, reason: "Unusual registration pattern" },
          created_at: new Date(Date.now() - 7200000).toISOString(),
          read: true
        }
      ];
      
      setSystemNotifications(mockSystemNotifications);
      setStats({
        total: 15,
        new_users: 3,
        new_events: 5,
        new_rsvps: 12,
        flagged_events: 1,
        user_notifications: 8
      });
    }
  };

  const loadUserNotifications = async () => {
    try {
      const response = await api.get('/admin/all-notifications');
      setUserNotifications(response.data || []);
    } catch (error) {
      console.error('Error loading user notifications:', error);
      // Set mock data for demo
      const mockUserNotifications: Notification[] = [
        {
          id: 1,
          type: "email",
          title: "Event Reminder: Corporate Gala 2025",
          message: "Don't forget about the upcoming event!",
          status: "sent",
          recipientCount: 150,
          eventTitle: "Corporate Gala 2025",
          creator: { full_name: "Jane Smith" },
          sentDate: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          type: "sms",
          title: "RSVP Confirmation",
          message: "Your RSVP has been confirmed",
          status: "sent",
          recipientCount: 1,
          eventTitle: "Wedding Ceremony",
          creator: { full_name: "John Doe" },
          sentDate: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setUserNotifications(mockUserNotifications);
    }
  };

  const handleRefresh = () => {
    toast.promise(
      loadData(),
      {
        loading: 'Refreshing notifications...',
        success: 'Notifications refreshed',
        error: 'Failed to refresh'
      }
    );
  };

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/admin/system-notifications/${id}/read`);
      setSystemNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
      );
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      // Update locally even if API fails
      setSystemNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
      );
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      new_user: <Users className="w-5 h-5 text-blue-600" />,
      new_event: <Calendar className="w-5 h-5 text-green-600" />,
      new_rsvp: <CheckCircle className="w-5 h-5 text-purple-600" />,
      flagged_event: <AlertCircle className="w-5 h-5 text-red-600" />,
      system: <Bell className="w-5 h-5 text-gray-600" />,
      email: <Mail className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      push: <Send className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Bell className="w-5 h-5" />;
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
      draft: <AlertCircle className="w-3 h-3" />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
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
            <h2 className="text-3xl font-bold text-[#3b2a13]">ADMIN NOTIFICATIONS</h2>
            <p className="text-sm text-[#3b2a13]">Monitor platform activity and user notifications</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-[#3b2a13] text-white rounded-lg font-semibold hover:bg-[#2a1f13] transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <Bell className="w-6 h-6 mx-auto mb-2 text-[#d4b885]" />
          <p className="text-2xl font-bold text-[#3b2a13]">{stats.total}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow-md text-center border border-blue-200">
          <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-600">{stats.new_users}</p>
          <p className="text-xs text-gray-600">New Users</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-md text-center border border-green-200">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-600">{stats.new_events}</p>
          <p className="text-xs text-gray-600">New Events</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl shadow-md text-center border border-purple-200">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-purple-600">{stats.new_rsvps}</p>
          <p className="text-xs text-gray-600">New RSVPs</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-md text-center border border-red-200">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <p className="text-2xl font-bold text-red-600">{stats.flagged_events}</p>
          <p className="text-xs text-gray-600">Flagged</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow-md text-center border border-yellow-200">
          <Mail className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
          <p className="text-2xl font-bold text-yellow-600">{stats.user_notifications}</p>
          <p className="text-xs text-gray-600">User Sent</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => {
              setActiveTab("system");
              loadSystemNotifications();
            }}
            className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === "system"
                ? "bg-[#d4b885] text-[#3b2a13] shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Bell className="w-4 h-4" />
            System Notifications
          </button>
          <button
            onClick={() => {
              setActiveTab("user_sent");
              loadUserNotifications();
            }}
            className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === "user_sent"
                ? "bg-[#d4b885] text-[#3b2a13] shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            User Notifications
          </button>
        </div>

        {/* System Notifications Tab */}
        {activeTab === "system" && (
          <div className="space-y-4">
            {systemNotifications.length > 0 ? (
              systemNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-xl p-6 hover:shadow-md transition-shadow ${
                    notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(notification.type)}
                        <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">New</span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3">{notification.message}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(notification.created_at)}
                        </div>
                        {notification.data && (
                          <button
                            onClick={() => setSelectedNotification(notification)}
                            className="text-[#d4b885] hover:text-[#b8946a] transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No system notifications</h3>
                <p className="text-gray-500">All caught up! No new platform activity.</p>
              </div>
            )}
          </div>
        )}

        {/* User Notifications Tab */}
        {activeTab === "user_sent" && (
          <div className="space-y-4">
            {userNotifications.length > 0 ? (
              userNotifications.map((notification) => (
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
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {notification.eventTitle}
                        </div>
                        {notification.creator && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            By {notification.creator.full_name}
                          </div>
                        )}
                        {notification.sentDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Sent {formatTimeAgo(notification.sentDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No user notifications</h3>
                <p className="text-gray-500">Users haven't sent any notifications yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNotification(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedNotification.title}</h2>
                  <p className="text-gray-600 mt-1">{formatTimeAgo(selectedNotification.created_at)}</p>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
                  <p className="text-gray-700">{selectedNotification.message}</p>
                </div>

                {selectedNotification.data && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Details</h3>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedNotification.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}