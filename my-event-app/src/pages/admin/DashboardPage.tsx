import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover">
          <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
            <h2 className="text-3xl font-bold text-[#3b2a13]">DASHBOARD</h2>
            <p className="text-sm text-[#3b2a13]">View event stats and recent activity</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#d4b885] p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Event Statistics</h3>
              <div className="space-y-2">
                <div>Total Events: <strong>5</strong></div>
                <div>Total Registration: <strong>200</strong></div>
                <div>Events Completed: <strong>3</strong></div>
              </div>
            </div>

            <div className="col-span-2 bg-white p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">E-MAIL MESSAGES</h3>
              <div className="text-gray-500">No new messages</div>
            </div>
          </div>

          <div className="mt-6 bg-[#d4b885] p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-3">REGISTERED ACCOUNTS</h3>
            <ul className="space-y-3 text-[#3b2a13]">
              <li className="flex justify-between"><span>Rica Faith Bariga</span><button className="underline">View</button></li>
              <li className="flex justify-between"><span>Angel Stacee Tabligan</span><button className="underline">View</button></li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
