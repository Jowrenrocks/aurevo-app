import React, { useState } from "react";
import { motion } from "framer-motion";
import dashboardBg from "../../assets/dashboard-bg.png";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  User, Mail, Calendar, Edit3, Save, X, 
  Phone, MapPin, Building, Award, 
  Camera, Shield, Bell, Lock
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [profile, setProfile] = useState({
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    phone: "+63 912 345 6789",
    location: "Manila, Philippines",
    company: "Event Management Co.",
    role: "Event Organizer",
    joined: "March 2024",
    about: "Passionate about creating unforgettable events and experiences. Specializing in corporate events, weddings, and social gatherings.",
    eventsCreated: 24,
    totalAttendees: 1250
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsReminders: true,
    eventReminders: true,
    weeklyDigest: false
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempData({ ...tempData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(tempData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempData(profile);
    setEditMode(false);
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
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
                      <p className="text-blue-100 text-sm font-medium">Events Created</p>
                      <p className="text-3xl font-bold mt-1">{profile.eventsCreated}</p>
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
                      <p className="text-purple-100 text-sm font-medium">Total Attendees</p>
                      <p className="text-3xl font-bold mt-1">{profile.totalAttendees}</p>
                    </div>
                    <User className="w-12 h-12 text-purple-200 opacity-80" />
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
                      <p className="text-green-100 text-sm font-medium">Member Since</p>
                      <p className="text-3xl font-bold mt-1">{profile.joined}</p>
                    </div>
                    <Award className="w-12 h-12 text-green-200 opacity-80" />
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
                        {profile.name.charAt(0)}
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-[#2b1e12] text-white rounded-full shadow-lg hover:bg-[#3b2e1e] transition">
                        <Camera size={16} />
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 text-[#3b2e1e] border-[#3b2e1e]/30 hover:bg-[#eacfa8]/80 font-semibold"
                    >
                      Change Photo
                    </Button>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 text-[#3b2e1e] space-y-4 w-full">
                    {!editMode ? (
                      <>
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-3xl font-bold text-[#2b1e12]">{profile.name}</h2>
                            <p className="text-[#4a3a27] font-medium mt-1">{profile.role}</p>
                          </div>
                          <Button
                            variant="outline"
                            className="text-[#3b2e1e] border-[#3b2e1e]/30 hover:bg-[#eacfa8]/80 flex items-center gap-2 font-semibold"
                            onClick={() => setEditMode(true)}
                          >
                            <Edit3 size={18} /> Edit
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="flex items-center gap-3 p-3 bg-[#fff3e2]/60 rounded-lg">
                            <Mail size={20} className="text-[#d4a373]" />
                            <div>
                              <p className="text-xs text-[#4a3a27]/70 font-medium">Email</p>
                              <p className="text-sm font-semibold text-[#2b1e12]">{profile.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-[#fff3e2]/60 rounded-lg">
                            <Phone size={20} className="text-[#d4a373]" />
                            <div>
                              <p className="text-xs text-[#4a3a27]/70 font-medium">Phone</p>
                              <p className="text-sm font-semibold text-[#2b1e12]">{profile.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-[#fff3e2]/60 rounded-lg">
                            <MapPin size={20} className="text-[#d4a373]" />
                            <div>
                              <p className="text-xs text-[#4a3a27]/70 font-medium">Location</p>
                              <p className="text-sm font-semibold text-[#2b1e12]">{profile.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-[#fff3e2]/60 rounded-lg">
                            <Building size={20} className="text-[#d4a373]" />
                            <div>
                              <p className="text-xs text-[#4a3a27]/70 font-medium">Company</p>
                              <p className="text-sm font-semibold text-[#2b1e12]">{profile.company}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h3 className="font-bold mb-3 text-[#2b1e12] flex items-center gap-2">
                            <User size={18} />
                            About Me
                          </h3>
                          <p className="text-sm bg-[#fff3e2] text-[#2b1e12] p-4 rounded-lg leading-relaxed shadow-sm border border-[#d4a373]/20">
                            {profile.about}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Edit Mode */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold mb-2 text-[#2b1e12] flex items-center gap-2">
                                <User size={16} /> Full Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={tempData.name}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold mb-2 text-[#2b1e12] flex items-center gap-2">
                                <Mail size={16} /> Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={tempData.email}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold mb-2 text-[#2b1e12] flex items-center gap-2">
                                <Phone size={16} /> Phone
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={tempData.phone}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold mb-2 text-[#2b1e12] flex items-center gap-2">
                                <MapPin size={16} /> Location
                              </label>
                              <input
                                type="text"
                                name="location"
                                value={tempData.location}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold mb-2 text-[#2b1e12] flex items-center gap-2">
                                <Building size={16} /> Company
                              </label>
                              <input
                                type="text"
                                name="company"
                                value={tempData.company}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold mb-2 text-[#2b1e12] flex items-center gap-2">
                                <Award size={16} /> Role
                              </label>
                              <input
                                type="text"
                                name="role"
                                value={tempData.role}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold mb-2 text-[#2b1e12]">About Me</label>
                            <textarea
                              name="about"
                              rows={5}
                              value={tempData.about}
                              onChange={handleChange}
                              className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 resize-none focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              variant="outline"
                              className="text-red-700 border-red-400 hover:bg-red-100 font-semibold flex items-center gap-2"
                              onClick={handleCancel}
                            >
                              <X size={18} /> Cancel
                            </Button>
                            <Button
                              variant="outline"
                              className="text-green-700 border-green-400 hover:bg-green-100 font-semibold flex items-center gap-2"
                              onClick={handleSave}
                            >
                              <Save size={18} /> Save Changes
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#2b1e12]">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#2b1e12]">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#2b1e12]">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full p-3 rounded-lg bg-[#fff3e2] text-[#2b1e12] border-2 border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 text-green-700 border-green-400 hover:bg-green-100 font-semibold"
                    >
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#f0d6b1]/95 border border-[#f5e6d0] rounded-2xl shadow-xl p-6">
                <CardContent>
                  <h3 className="text-xl font-bold text-[#2b1e12] mb-4 flex items-center gap-2">
                    <Shield size={20} />
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-[#fff3e2]/60 rounded-lg">
                    <div>
                      <p className="font-semibold text-[#2b1e12]">Enable 2FA</p>
                      <p className="text-sm text-[#4a3a27]/70">Add extra security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-14 h-7 bg-[#d4a373]/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d4a373]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-[#d4a373] after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2b1e12]"></div>
                    </label>
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
                  <Button
                    variant="outline"
                    className="mt-6 text-green-700 border-green-400 hover:bg-green-100 font-semibold flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}