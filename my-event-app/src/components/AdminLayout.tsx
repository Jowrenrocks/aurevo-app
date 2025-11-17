import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  LogOut,
  Menu,
  User,
  Bell,
  CheckCircle,
} from "lucide-react";

interface AdminLayoutProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminLayout({ setIsLoggedIn }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  setIsLoggedIn(false);
  navigate("/login");
};


  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "View Events", path: "/admin/events", icon: <Calendar size={20} /> },
    { name: "Pending Payments", path: "/admin/payments", icon: <DollarSign size={20} /> },
    { name: "Event Approvals", path: "/admin/approvals", icon: <CheckCircle size={20} /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#f9f4ef] text-white relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen p-5 flex flex-col bg-[#1f1f1f]/95 backdrop-blur-md transition-all duration-300 overflow-y-auto
        ${collapsed ? "w-20" : "w-64"}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between mb-10">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-wide whitespace-nowrap">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:opacity-80 transition"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#a18665] text-white"
                    : "text-gray-300 hover:bg-[#a18665]/60 hover:text-white"
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-red-400 hover:text-red-600 transition mt-auto"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 bg-[#f9f4ef] min-h-screen overflow-y-auto transition-all duration-300`}
        style={{
          marginLeft: collapsed ? "5rem" : "16rem", // adjust content width when collapsed
        }}
      >
        {/* Header */}
        <header className="bg-black text-white p-4 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold">AURÉVO EVENT MANAGEMENT</h1>
            <p className="text-xs text-gray-300">
              NAPOCOR, TAGOLOAN, MISAMIS ORIENTAL
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6" />
            <div className="flex items-center gap-2">
              <User className="w-6 h-6" />
              <span className="font-semibold">ADMIN</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="p-8 text-[#2e2e2e] bg-[url('/src/assets/dashboard-bg.png')] bg-cover bg-center min-h-[calc(100vh-80px)]">
          <div className="bg-[#d9bfa9]/80 rounded-2xl p-6 shadow-lg">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
