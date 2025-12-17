import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dashboardBg from "../../assets/dashboard-bg.png";
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
        full_name: response.data.full_name || '',
        email: response.data.email || ''
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load profile data';
      toast.error(errorMessage);
      setProfile(null);
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
    if (!name || typeof name !== 'string') {
      return 'U'; // Default to 'U' for User
    }
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b885] mx-auto"></div>
          <p className="mt-4 text-[#3b2a13]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#3b2a13] mb-2">Failed to Load Profile</h2>
          <p className="text-gray-600 mb-4">Unable to fetch your profile information</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-[#d4b885] text-[#3b2a13] rounded-lg font-semibold hover:bg-[#c4b184] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl mb-6 shadow-lg">
        <h2 className="text-3xl font-bold text-[#3b2a13]">MY PROFILE</h2>
        <p className="text-sm text-[#3b2a13] mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Member Since</p>
              <p className="text-2xl font-bold text-[#3b2a13]">
                {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Account Type</p>
              <p className="text-2xl font-bold text-[#3b2a13] capitalize">
                {profile.role?.name || 'User'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Account Status</p>
              <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Active
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            <Shield size={18} />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'notifications'
                ? "bg-white text-[#3b2a13] shadow-md"
                : "bg-[#cbb88b] text-[#3b2a13] hover:bg-[#c4b184]"
            }`}
          >
            <Bell size={18} />
            Notifications
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#d4b885] to-[#b8946a] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {getInitials(profile.full_name)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-[#3b2a13] text-white rounded-full shadow-lg hover:bg-[#2a1f13] transition">
                    <Camera size={16} />
                  </button>
                </div>
                <p className="mt-3 text-sm text-gray-600">Profile Picture</p>
              </div>

              {/* Info Section */}
              <div className="flex-1 w-full">
                {!editMode ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-[#3b2a13]">{profile.full_name}</h2>
                        <p className="text-gray-600 mt-1 capitalize">
                          {profile.role?.name || 'User'} Account
                        </p>
                      </div>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <Edit3 size={16} />
                        Edit Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-[#d4b885]" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Email Address</p>
                          <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-[#d4b885]" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">User ID</p>
                          <p className="text-sm font-semibold text-gray-900">#{profile.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                        <Calendar className="w-5 h-5 text-[#d4b885]" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Account Created</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(profile.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#3b2a13] mb-4">Edit Profile Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Changing your email may require re-verification
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-[#3b2a13] mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    name="new_password_confirmation"
                    value={passwordForm.new_password_confirmation}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b885] focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-[#3b2a13] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Account ID</span>
                  <span className="font-bold text-[#3b2a13]">#{profile.id}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Account Type</span>
                  <span className="font-bold text-[#3b2a13] capitalize">
                    {profile.role?.name || 'User'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Status</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#3b2a13] mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-[#3b2a13] capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-600">
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
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d4b885]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#d4b885]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}