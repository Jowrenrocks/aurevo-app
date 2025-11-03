import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { User } from "lucide-react";

// 👇 Add this interface so TypeScript knows it accepts the prop
interface DashboardLayoutProps {
  setIsLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardLayout({ setIsLoggedIn }: DashboardLayoutProps) {
  const location = useLocation();

  const links = [
    { path: "/user/dashboard", label: "USER DASHBOARD" },
    { path: "/user/create-event", label: "CREATE EVENT" },
    { path: "/user/events", label: "MY EVENTS" },
    { path: "/user/profile", label: "PROFILE" },
    { path: "/admin/dashboard", label: "ADMIN DASHBOARD" },
    { path: "/admin/events", label: "VIEW EVENTS" },
    { path: "/admin/payments", label: "PENDING PAYMENTS" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#D2B48C] text-black">
      {/* Header */}
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">
          AURÉVO EVENT MANAGEMENT
          <span className="block text-sm">NAPOCOR, TAGOLOAN, MISAMIS ORIENTAL</span>
        </h1>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span>ADMIN</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#D2B48C] p-6 shadow-lg">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-center py-3 font-bold rounded-lg border border-black shadow-sm transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-[#E3C383] shadow-[4px_4px_0_#000]"
                    : "bg-white hover:bg-[#F4E3C0]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Example Logout button (optional) */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn?.(false);
            }}
            className="mt-8 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-[url('/src/assets/dashboard-bg.png')] bg-cover bg-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
