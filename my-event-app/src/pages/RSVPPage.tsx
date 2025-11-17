import { useState, useEffect } from "react";
import bg from "../assets/rsvp-bg.png"; // use your background image
import theme1 from "../assets/theme1.png";
import theme2 from "../assets/theme2.png";
import theme3 from "../assets/theme3.png";
import theme4 from "../assets/theme4.png";
import theme5 from "../assets/theme5.png";
import theme6 from "../assets/theme6.png";
import theme7 from "../assets/theme7.png";
import theme8 from "../assets/theme8.png";

export default function RSVPPage() {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    eventName: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    theme: "",
    name: "",
    place: "",
    date: "",
    time: "",
  });

  // Load last step and data from localStorage
  useEffect(() => {
    const savedStep = localStorage.getItem("rsvpStep");
    const savedData = localStorage.getItem("rsvpData");
    if (savedStep) setStep(Number(savedStep));
    if (savedData) setEventData(JSON.parse(savedData));
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem("rsvpStep", step.toString());
    localStorage.setItem("rsvpData", JSON.stringify(eventData));
  }, [step, eventData]);

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleThemeSelect = (theme: string) => {
    setEventData({ ...eventData, theme });
    handleNext();
  };

  const handleSubmit = () => {
    localStorage.removeItem("rsvpStep");
    localStorage.removeItem("rsvpData");
    setStep(5); // final confirmation page
  };

  const StepIndicator = () => (
    <div className="flex justify-center items-center space-x-6 text-white mb-8">
      {["Event Name", "Event Details", "Choose Theme", "Event Info"].map((label, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step === i + 1 ? "bg-[#f4b860] text-black" : "bg-white text-black"
            }`}
          >
            {i + 1}
          </div>
          <span className="tracking-widest text-xs uppercase">{label}</span>
          {i < 3 && <div className="w-10 h-[2px] bg-white"></div>}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h1 className="text-sm tracking-[6px] mb-4 uppercase">
        MAKE EVERY OCCASION UNFORGETTABLE WITH AURÉVO
      </h1>

      <StepIndicator />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-xl tracking-widest font-semibold">
            WHAT IS THE NAME OF YOUR EVENT?
          </h2>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            className="p-3 rounded-xl w-[400px] text-black text-center"
          />
          <button
            onClick={handleNext}
            className="bg-black px-8 py-3 rounded-xl text-white tracking-[4px] uppercase hover:bg-[#f4b860] hover:text-black transition"
          >
            Continue to Next Step
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-xl tracking-widest font-semibold">
            WHEN IS YOUR EVENT?
          </h2>
          <div className="flex gap-6">
            <div>
              <p className="mb-2">Event Start</p>
              <input
                type="date"
                name="startDate"
                value={eventData.startDate}
                onChange={handleChange}
                className="p-2 rounded-xl text-black"
              />
              <input
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                className="p-2 rounded-xl text-black ml-2"
              />
            </div>
            <div>
              <p className="mb-2">Event End</p>
              <input
                type="date"
                name="endDate"
                value={eventData.endDate}
                onChange={handleChange}
                className="p-2 rounded-xl text-black"
              />
              <input
                type="time"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
                className="p-2 rounded-xl text-black ml-2"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handlePrev}
              className="bg-gray-500 px-6 py-2 rounded-xl uppercase"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-black px-8 py-3 rounded-xl text-white tracking-[4px] uppercase hover:bg-[#f4b860] hover:text-black transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-xl tracking-widest font-semibold mb-2">
            CHOOSE A THEME
          </h2>
          <p className="text-sm mb-4">TO GIVE YOU A HEAD START ON YOUR EVENT!</p>
          <div className="grid grid-cols-4 gap-4">
            {[theme1, theme2, theme3, theme4, theme5, theme6, theme7, theme8].map((t, i) => (
              <img
                key={i}
                src={t}
                alt={`Theme ${i + 1}`}
                onClick={() => handleThemeSelect(t)}
                className={`w-40 h-60 rounded-lg cursor-pointer border-4 ${
                  eventData.theme === t ? "border-[#f4b860]" : "border-transparent"
                } hover:scale-105 transition`}
              />
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="bg-gray-500 px-6 py-2 rounded-xl uppercase mt-6"
          >
            Back
          </button>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl tracking-widest font-semibold mb-2">
            FILL OUT YOUR EVENT INFORMATION
          </h2>

          <div className="flex gap-12 items-start">
            {eventData.theme && (
              <img
                src={eventData.theme}
                alt="Selected Theme"
                className="w-64 rounded-lg shadow-lg"
              />
            )}
            <div className="space-y-4 text-black">
              {["name", "place", "date", "time"].map((field) => (
                <div key={field}>
                  <label className="text-white uppercase tracking-widest mr-2">
                    {field}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={(eventData as any)[field]}
                    onChange={handleChange}
                    className="p-2 rounded-xl w-64"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="bg-gray-500 px-6 py-2 rounded-xl uppercase"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 px-8 py-3 rounded-xl text-white tracking-[4px] uppercase hover:bg-green-500 transition"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 — Confirmation */}
      {step === 5 && (
        <div className="text-center space-y-6">
          <h2 className="text-sm tracking-[6px] uppercase">
            YOUR RSVP HAS BEEN CONFIRMED
          </h2>
          <div className="flex justify-center">
            {eventData.theme && (
              <img
                src={eventData.theme}
                alt="Final Theme"
                className="w-64 rounded-lg shadow-lg"
              />
            )}
          </div>
          <p className="text-lg max-w-md mx-auto leading-relaxed">
            THANK YOU FOR AVAILING AND TRUSTING OUR EVENT. WE HOPE YOU ENJOYED
            YOUR DAY!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#f4b860] text-black px-8 py-3 rounded-xl tracking-[4px] uppercase hover:bg-white transition"
          >
            Share
          </button>
        </div>
      )}
    </div>
  );
}
