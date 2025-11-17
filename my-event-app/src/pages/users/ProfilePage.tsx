import React, { useState } from "react";
import { motion } from "framer-motion";
import dashboardBg from "../../assets/dashboard-bg.png";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { User, Mail, Calendar, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    role: "Event Organizer",
    joined: "March 2024",
    about: "Passionate about creating unforgettable events and experiences.",
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

  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <div className="flex-1 bg-black/40 backdrop-blur-md min-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif font-bold text-[#fff9f3] mb-8 drop-shadow-lg"
          >
            My Profile
          </motion.h1>

          {/* Profile Card */}
          <Card className="bg-[#f0d6b1]/95 border border-[#f5e6d0] rounded-2xl shadow-xl p-6">
            <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-[#f7e0c3] flex items-center justify-center text-[#3b2e1e] text-4xl font-bold shadow-md">
                  {profile.name.charAt(0)}
                </div>
                <Button
                  variant="outline"
                  className="mt-4 text-[#3b2e1e] border-[#3b2e1e]/30 hover:bg-[#eacfa8]/80 font-semibold"
                >
                  Change Photo
                </Button>
              </div>

              {/* Info Section */}
              <div className="flex-1 text-[#3b2e1e] space-y-4">
                {!editMode ? (
                  <>
                    <h2 className="text-2xl font-bold text-[#2b1e12]">{profile.name}</h2>
                    <p className="flex items-center gap-2 text-[#4a3a27] font-medium">
                      <Mail size={18} /> {profile.email}
                    </p>
                    <p className="flex items-center gap-2 text-[#4a3a27] font-medium">
                      <User size={18} /> {profile.role}
                    </p>
                    <p className="flex items-center gap-2 text-[#4a3a27] font-medium">
                      <Calendar size={18} /> Joined {profile.joined}
                    </p>

                    <div className="mt-4">
                      <h3 className="font-semibold mb-2 text-[#2b1e12]">About Me</h3>
                      <p className="text-sm bg-[#fff3e2] text-[#2b1e12] p-3 rounded-md leading-relaxed shadow-sm">
                        {profile.about}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="mt-6 text-[#3b2e1e] border-[#3b2e1e]/30 hover:bg-[#eacfa8]/80 flex items-center gap-2 font-semibold"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit3 size={18} /> Edit Profile
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Edit Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-[#2b1e12]">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={tempData.name}
                          onChange={handleChange}
                          className="w-full p-2 rounded bg-[#fff3e2] text-[#2b1e12] border border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-[#2b1e12]">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={tempData.email}
                          onChange={handleChange}
                          className="w-full p-2 rounded bg-[#fff3e2] text-[#2b1e12] border border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-[#2b1e12]">Role</label>
                        <input
                          type="text"
                          name="role"
                          value={tempData.role}
                          onChange={handleChange}
                          className="w-full p-2 rounded bg-[#fff3e2] text-[#2b1e12] border border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-[#2b1e12]">Joined</label>
                        <input
                          type="text"
                          name="joined"
                          value={tempData.joined}
                          onChange={handleChange}
                          className="w-full p-2 rounded bg-[#fff3e2] text-[#2b1e12] border border-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold mb-1 text-[#2b1e12]">About Me</label>
                      <textarea
                        name="about"
                        rows={4}
                        value={tempData.about}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-[#fff3e2] text-[#2b1e12] border border-[#d4a373]/50 resize-none focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        variant="outline"
                        className="text-red-700 border-red-400 hover:bg-red-100 font-semibold"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        className="text-green-700 border-green-400 hover:bg-green-100 font-semibold"
                        onClick={handleSave}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
