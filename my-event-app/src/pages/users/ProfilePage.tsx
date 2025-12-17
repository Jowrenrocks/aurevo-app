import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dashboardBg from "../../assets/dashboard-bg.png";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  User, Mail, Calendar, Edit3, Save, X,
  Shield, Bell, Lock, Camera, CheckCircle, AlertCircle, Loader2
} from "lucide-react";
import api from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  created_at: string;
  events_count?: number;
  total_rsvps?: number;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: ''
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsReminders: false,
    eventReminders: true,
    weeklyDigest: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      setProfile(response.data);
      setEditForm({
        full_name: response.data.full_name,
        email: response.data.email
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!editForm.full_name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (!editForm.email.trim() || !editForm.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/update-profile', {
        full_name: editForm.full_name,
        email: editForm.email
      });
      
      // Refresh profile data
      await fetchProfile();
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name,
        email: profile.email
      });
    }
    setEditMode(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await api.put('/auth/change-password', {
        current_password: passwordForm.current_password,
        password: passwordForm.new_password,
        password_confirmation: passwordForm.new_password_confirmation
      });
      
      toast.success('Password changed successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success('Notification preferences updated');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex bg-cover bg-center"
        style={{ backgroundImage: `url(${dashboardBg})` }}
      >
        <div className="flex-1 bg-black/40 backdrop-blur-md min-h-screen overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="min-h-screen flex bg-cover bg-center"
        style={{ backgroundImage: `url(${dashboardBg})` }}
      >
        <div className="flex-1 bg-black/40 backdrop-blur-md min-h-screen overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Profile</h2>
            <p className="text-gray-300 mb-4">Unable to fetch your profile information</p>
            <button
              onClick={fetchProfile}
              className="px-6 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <Toaster position="top-right" />
      <div className="flex-1 bg-black/40 backdrop-blur-md min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-serif font-bold text-[#fff9f3] drop-shadow-lg">
              My Profile
            </h1>
            <p className="text-[#f5e6d0]/80 mt-2">Manage your account settings and preferences</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/90 to-blue-600/90 border-0 shadow-xl">
                <CardContent className="p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Member Since</p>
                      <p className="text-2xl font-bold mt-1">
                        {formatDate(profile.created_at)}
                      </p>
                    </div>
                    <Calendar className="w-12 h-12 text-blue-200 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/90 to-purple-600/90 border-0 shadow-xl">
                <CardContent className="p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Account Type</p>
                      <p className="text-2xl font-bold mt-1 capitalize">
                        {profile.role?.name || 'User'}
                      </p>
                    </div>
                    <Shield className="w-12 h-12 text-purple-200 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-green-500/90 to-green-600/90 border-0 shadow-xl">
                <CardContent className="p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Account Status</p>
                      <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6" />
                        Active
                      </p>
                    </div>
                    <User className="w-12 h-12 text-green-200 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-t-xl font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#f0d6b1]/95 text-[#2b1e12] shadow-lg'
                  : 'bg-[#f0d6b1]/50 text-[#3b2e1e]/70 hover:bg-[#f0d6b1]/70'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={18} />
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 rounded-t-xl font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-[#f0d6b1]/95 text-[#2b1e12] shadow-lg'
                  : 'bg-[#f0d6b1]/50 text-[#3b2e1e]/70 hover:bg-[#f0d6b1]/70'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield size={18} />
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 rounded-t-xl font-semibold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-[#f0d6b1]/95 text-[#2b1e12] shadow-lg'
                  : 'bg-[#f0d6b1]/50 text-[#3b2e1e]/70 hover:bg-[#f0d6b1]/70'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell size={18} />
                Notifications
              </div>
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-[#f0d6b1]/95 border border-[#f5e6d0] rounded-2xl shadow-xl p-6">
                <CardContent className="flex flex-col md:flex-row items-start gap-8">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#f7e0c3] to-[#eacfa8] flex items-center justify-center text-[#3b2e1e] text-4xl font-bold shadow-lg ring-4 ring-[#f5e6d0]">
                        {getInitials(profile.full_name)}
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-[#2b1e12] text-white rounded-full shadow-lg hover:bg-[#3b2e1e] transition">
                        <Camera size={16} />
                      </button>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">Profile Picture</p>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 text-[#3b2e1e] space-y-4 w-full">
                    {!editMode ? (
                      <>
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-3xl font-bold text-[#2b1e12]">{profile.full_name}</h2>
                            <p className="text-[#4a3a27] font-medium mt-1 capitalize">
                              {profile.role?.name || 'User'} Account
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="text-[#3b2e1e] border-[#3b2e1e]/30 hover:bg-[#eacfa8]/80 flex items-center gap-2 font-semibold"
                            onClick={() => setEditMode(true)}
                          >
                            <Edit3 size={18} /> Edit
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-6">
                          <div className="flex items-center gap-3 p-4 bg-[#fff3e2]/60 rounded-lg">
                            <Mail size={20} className="text-[#d4a373]" />
                            <div className="flex-1">
                              <p className="text-xs text-[#4a3a27]/70 font-medium">Email Address</p>
                              <p className="text-sm font-semibold text-[#2b1e12]">{profile.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-[#fff3e2]/60 rounded-lg">
                            <User size={20} className="text-[#d4a373]" />
                            <div className="flex-1">
                              <p className="text-xs text-[#4a3a27]/70 font-medium">User ID</p>
                              <p className="text-sm font-semibold text-[#2b1e12]">#{profile.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-[#fff3e2]/60 rounded-lg">
                            <Calendar size={20} className="text-[#d4a373]" />
                            <div className="flex-1">
                              <p className="text-xs text-[#4a3a27]/70 font-medium">Account Created</p>
                              <p className="text-sm font-semibold text-[#2b1e12]">
                                {formatDate(profile.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Edit Mode */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold mb-2 text-[#2b1e12] flex items-center gap-2">
                              <User size={16} /> Full Name *
                            </label>
                            <input
                              type="text"
                              name="full_name"
                              value={editForm.full_name}
                              onChange={handleEditChange}
                              className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold mb-2 text-[#2b1e12] flex items-center gap-2">
                              <Mail size={16} /> Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={editForm.email}
                              onChange={handleEditChange}
                              className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                              required
                            />
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                            <p className="text-sm text-blue-800">
                              <strong>Note:</strong> Changing your email may require re-verification
                            </p>
                          </div>

                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              variant="outline"
                              className="text-red-700 border-red-400 hover:bg-red-100 font-semibold flex items-center gap-2"
                              onClick={handleCancelEdit}
                              disabled={saving}
                            >
                              <X size={18} /> Cancel
                            </Button>
                            <Button
                              variant="outline"
                              className="text-green-700 border-green-400 hover:bg-green-100 font-semibold flex items-center gap-2"
                              onClick={handleSaveProfile}
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <Loader2 size={18} className="animate-spin" /> Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={18} /> Save Changes
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="bg-[#f0d6b1]/95 border border-[#f5e6d0] rounded-2xl shadow-xl p-6">
                <CardContent>
                  <h3 className="text-xl font-bold text-[#2b1e12] mb-6 flex items-center gap-2">
                    <Lock size={20} />
                    Change Password
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#2b1e12]">Current Password *</label>
                      <input
                        type="password"
                        name="current_password"
                        value={passwordForm.current_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#2b1e12]">New Password *</label>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password (min 6 characters)"
                        className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#2b1e12]">Confirm New Password *</label>
                      <input
                        type="password"
                        name="new_password_confirmation"
                        value={passwordForm.new_password_confirmation}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                        required
                        minLength={6}
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="mt-4 text-green-700 border-green-400 hover:bg-green-100 font-semibold flex items-center gap-2"
                      disabled={changingPassword}
                    >
                      {changingPassword ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <Lock size={18} /> Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-[#f0d6b1]/95 border border-[#f5e6d0] rounded-2xl shadow-xl p-6">
                <CardContent>
                  <h3 className="text-xl font-bold text-[#2b1e12] mb-4 flex items-center gap-2">
                    <Shield size={20} />
                    Account Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 bg-[#fff3e2]/60 rounded-lg">
                      <span className="text-gray-700">Account ID:</span>
                      <span className="font-semibold text-[#2b1e12]">#{profile.id}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#fff3e2]/60 rounded-lg">
                      <span className="text-gray-700">Account Type:</span>
                      <span className="font-semibold text-[#2b1e12] capitalize">
                        {profile.role?.name || 'User'}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#fff3e2]/60 rounded-lg">
                      <span className="text-gray-700">Status:</span>
                      <span className="font-semibold text-green-600 flex items-center gap-1">
                        <CheckCircle size={16} /> Active
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-[#f0d6b1]/95 border border-[#f5e6d0] rounded-2xl shadow-xl p-6">
                <CardContent>
                  <h3 className="text-xl font-bold text-[#2b1e12] mb-6 flex items-center gap-2">
                    <Bell size={20} />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-[#fff3e2]/60 rounded-lg">
                        <div>
                          <p className="font-semibold text-[#2b1e12] capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-[#4a3a27]/70">
                            {key === 'emailUpdates' && 'Receive email updates about your events'}
                            {key === 'smsReminders' && 'Get SMS reminders for upcoming events'}
                            {key === 'eventReminders' && 'Notify me before events start'}
                            {key === 'weeklyDigest' && 'Weekly summary of your activities'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleNotificationToggle(key as keyof typeof notifications)}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-[#d4a373]/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d4a373]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-[#d4a373] after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2b1e12]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}