export default function AdminDashboardPage() {
  return (
    <div className="p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover min-h-screen">
      {/* Header Section */}
      <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-[#3b2a13]">DASHBOARD</h2>
        <p className="text-sm text-[#3b2a13]">View event stats and recent activity</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <h3 className="text-xl font-semibold mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">5</p>
        </div>
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <h3 className="text-xl font-semibold mb-2">Total Registrations</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">200</p>
        </div>
        <div className="bg-[#d4b885] p-6 rounded-2xl text-center shadow-md">
          <h3 className="text-xl font-semibold mb-2">Completed Events</h3>
          <p className="text-3xl font-bold text-[#3b2a13]">3</p>
        </div>
      </div>

      {/* Email and Registered Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email Messages */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-[#3b2a13]">E-MAIL MESSAGES</h3>
          <p className="text-gray-500 italic">No new messages</p>
        </div>

        {/* Registered Accounts */}
        <div className="bg-[#d4b885] p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-3 text-[#3b2a13]">REGISTERED ACCOUNTS</h3>
          <ul className="space-y-3 text-[#3b2a13]">
            <li className="flex justify-between">
              <span>Rica Faith Bariga</span>
              <button className="underline">View</button>
            </li>
            <li className="flex justify-between">
              <span>Angel Stacee Tabligan</span>
              <button className="underline">View</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
