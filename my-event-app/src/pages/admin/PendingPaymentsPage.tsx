import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { useState } from "react";

export default function PendingPaymentsPage() {
  const [paid, setPaid] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover">
          <div className="bg-[#d4b885] p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-[#3b2a13]">PENDING PAYMENT</h2>

            <div className="mt-6 bg-[#d4b885] p-8 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold">Angel Stacee Tabligan</h3>
                  <div className="text-sm italic">Booked for : Birthday Event</div>
                </div>
                <div className="text-sm">05-02-2025</div>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between">
                  <div>Venue Rental :</div>
                  <div className="bg-white px-6 py-2 rounded-full">20,000</div>
                  <button onClick={() => setPaid(true)} className={`px-4 py-1 rounded-full ${paid ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{paid ? "Done" : "Pending"}</button>
                </div>

                <div className="flex items-center justify-between">
                  <div>Catering :</div>
                  <div className="bg-white px-6 py-2 rounded-full">30,000</div>
                  <button className="px-4 py-1 rounded-full bg-red-500 text-white">Pending</button>
                </div>

                <div className="flex items-center justify-between">
                  <div>Entertainment :</div>
                  <div className="bg-white px-6 py-2 rounded-full">5,000</div>
                  <button className="px-4 py-1 rounded-full bg-red-500 text-white">Pending</button>
                </div>

                <div className="flex items-center justify-between font-bold">
                  <div>Total :</div>
                  <div className="bg-white px-6 py-2 rounded-full">55,000</div>
                </div>

                <div className="text-center mt-6">
                  <button className="px-6 py-3 rounded-full bg-green-600 text-white font-bold">Successful Payment</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
