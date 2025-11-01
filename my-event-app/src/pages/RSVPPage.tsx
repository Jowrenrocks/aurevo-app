import React, { useState } from "react";
import bg from "../assets/rsvp-bg.png";
import logo from "../assets/logo.png";

export default function RSVPPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    theme: "",
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center text-white px-6 md:px-12 w-full max-w-4xl">
        {/* HEADER */}
        <h1 className="text-sm md:text-lg tracking-widest mb-6">
          MAKE EVERY OCCASION UNFORGETTABLE WITH AURÉVO
        </h1>

        {/* STEP INDICATOR */}
        <div className="flex justify-center items-center space-x-6 mb-10">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                  step === num ? "bg-[#f6b24e] text-black" : "bg-white text-black"
                }`}
              >
                {num}
              </div>
              <p className="mt-2 text-xs md:text-sm font-light tracking-wider uppercase">
                {num === 1
                  ? "Event Name"
                  : num === 2
                  ? "Event Details"
                  : num === 3
                  ? "Choose Theme"
                  : "Event Information"}
              </p>
            </div>
          ))}
        </div>

        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Aurévo Logo" className="w-20 h-20 object-contain" />
        </div>

        {/* FORM CONTENT */}
        <div className="bg-white/90 text-black rounded-2xl p-8 shadow-lg">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                What is the name of your event?
              </h2>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Enter event name"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#a18665] focus:outline-none mb-6"
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">
                When is your event?
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Not sure yet? You can add timing later.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Event Start</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-gray-300 mb-2"
                  />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Event End</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-gray-300 mb-2"
                  />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-gray-300"
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">Choose your theme</h2>
              <p className="text-center text-gray-600 mb-6">
                Select your preferred event theme.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Wedding", "Birthday", "Corporate", "Debut", "Anniversary", "Other"].map(
                  (theme) => (
                    <button
                      key={theme}
                      onClick={() => setFormData({ ...formData, theme })}
                      className={`p-3 rounded-xl border ${
                        formData.theme === theme
                          ? "bg-[#a18665] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {theme}
                    </button>
                  )
                )}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">
                Where is your party taking place?
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Not sure yet? You can add the location later.
              </p>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#a18665] focus:outline-none mb-6"
              />
            </>
          )}

          {/* NEXT BUTTON */}
          <button
            onClick={handleNext}
            className="w-full bg-[#3b3836] text-white font-semibold py-3 rounded-xl hover:bg-[#504c4a] transition"
          >
            {step === 4 ? "Finish" : "Continue to Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
