import React, { useState } from "react";
import dashboardBg from "../../assets/dashboard-bg.png";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function CreateEventPage() {
  const [eventData, setEventData] = useState({
    name: "",
    venue: "",
    people: "",
    date: "",
    time: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      {/* Semi-transparent overlay for readability */}
      <div className="flex-1 bg-black/40 min-h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif font-bold text-white mb-8 text-center"
          >
            Create Event
          </motion.h1>

          {/* Form Card */}
          <Card className="bg-[#ffffff]/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 text-white">
                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Name */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Event Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={eventData.name}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#e5d1aa] text-black placeholder-black/70 focus:outline-none"
                      placeholder="Enter event name"
                      required
                    />
                  </div>

                  {/* Number of People */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Number of People
                    </label>
                    <select
                      name="people"
                      value={eventData.people}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#e5d1aa] text-black focus:outline-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="50">Up to 50</option>
                      <option value="100">Up to 100</option>
                      <option value="200">Up to 200</option>
                      <option value="500">Up to 500</option>
                    </select>
                  </div>

                  {/* Venues */}
                  <div>
                    <label className="block font-semibold mb-2">Venues</label>
                    <select
                      name="venue"
                      value={eventData.venue}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#e5d1aa] text-black focus:outline-none"
                      required
                    >
                      <option value="">Select Venue</option>
                      <option value="Tagoloan Convention Center">
                        Tagoloan Convention Center
                      </option>
                      <option value="SMX Convention">SMX Convention</option>
                      <option value="Private Residence">
                        Private Residence
                      </option>
                    </select>
                  </div>

                  {/* Special Request / Message */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Special Request / Message
                    </label>
                    <textarea
                      name="message"
                      value={eventData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-2 rounded bg-[#e5d1aa] text-black resize-none focus:outline-none placeholder-black/70"
                      placeholder="Enter special requests..."
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={eventData.date}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#e5d1aa] text-black focus:outline-none"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block font-semibold mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={eventData.time}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-[#e5d1aa] text-black focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    className="bg-green-500 text-white hover:bg-green-600 px-6 py-2 rounded-full"
                  >
                    Create Event
                  </Button>

                  {submitted && (
                    <p className="text-white mt-3 font-semibold">
                      Event Created Successfully!!
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
