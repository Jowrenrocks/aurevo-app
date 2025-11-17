import { useState } from "react";

export default function PendingPaymentsPage() {
  const [paid, setPaid] = useState(false);

  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-[#3b2a13]">PENDING PAYMENT</h2>
      </div>

      {/* Payment Details */}
      <div className="bg-[#d4b885] p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-semibold text-[#3b2a13]">
              Angel Stacee Tabligan
            </h3>
            <div className="text-sm italic text-gray-700">
              Booked for: Birthday Event
            </div>
          </div>
          <div className="text-sm text-gray-700">05-02-2025</div>
        </div>

        <div className="space-y-4">
          {/* Payment Items */}
          {[
            { label: "Venue Rental", amount: 20000 },
            { label: "Catering", amount: 30000 },
            { label: "Entertainment", amount: 5000 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#e8cf94] px-4 py-2 rounded-lg"
            >
              <div>{item.label}:</div>
              <div className="bg-white px-6 py-1 rounded-full font-semibold">
                {item.amount.toLocaleString()}
              </div>
              <button
                onClick={() => setPaid(!paid)}
                className={`px-4 py-1 rounded-full font-semibold ${
                  paid ? "bg-green-600 text-white" : "bg-red-500 text-white"
                }`}
              >
                {paid ? "Done" : "Pending"}
              </button>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between font-bold text-[#3b2a13] mt-4">
            <div>Total:</div>
            <div className="bg-white px-6 py-2 rounded-full">55,000</div>
          </div>

          {/* Success Button */}
          <div className="text-center mt-6">
            <button className="px-6 py-3 rounded-full bg-green-600 text-white font-bold hover:bg-green-700">
              Successful Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
