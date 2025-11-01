import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { useState } from "react";

export default function ViewEventsPage() {
  const [tab, setTab] = useState<"registered" | "upcoming">("registered");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover">
          <div className="bg-[#d4b885] p-6 rounded-2xl mb-6">
            <h2 className="text-3xl font-bold text-[#3b2a13]">VIEW EVENTS</h2>
          </div>

          <div className="bg-[#d4b885] p-6 rounded-2xl">
            <div className="flex gap-4 mb-4">
              <button onClick={() => setTab("registered")} className={`px-4 py-2 rounded-xl ${tab === "registered" ? "bg-white" : "bg-[#cbb88b]"}`}>Registered List</button>
              <button onClick={() => setTab("upcoming")} className={`px-4 py-2 rounded-xl ${tab === "upcoming" ? "bg-white" : "bg-[#cbb88b]"}`}>Upcoming Events</button>
            </div>

            {tab === "registered" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="text-xl font-semibold">Angel Stacee Tabligan</div>
                    <div className="text-sm italic text-gray-700">Registered for "Birthday Event"</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Just now</span>
                    <button className="px-3 py-1 bg-green-400 rounded">Accept</button>
                    <button className="px-3 py-1 bg-red-500 rounded text-white">Decline</button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="text-xl font-semibold">Nana George</div>
                    <div className="text-sm italic text-gray-700">Registered for "Anniversary Event"</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">5 Days ago</span>
                    <button className="px-3 py-1 bg-green-400 rounded">Accept</button>
                    <button className="px-3 py-1 bg-red-500 rounded text-white">Decline</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <div>
                    <div className="text-xl font-semibold">Angel Stacee Tabligan</div>
                    <div className="text-sm italic text-gray-700">"Birthday Event"</div>
                  </div>
                  <div className="text-sm text-gray-700">MAY 7 2026</div>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <div>
                    <div className="text-xl font-semibold">Nana George</div>
                    <div className="text-sm italic text-gray-700">"Anniversary Event"</div>
                  </div>
                  <div className="text-sm text-gray-700">MAY 20 2026</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
