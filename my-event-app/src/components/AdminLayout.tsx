import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  LogOut,
  Menu,
  User,
  Bell,
  Plus,
  Users,
  BarChart,
  Settings,
  ChevronDown,
} from "lucide-react";

interface AdminLayoutProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminLayout({ setIsLoggedIn }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
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
    {
      name: "Events",
      icon: <Calendar size={20} />,
      subItems: [
        { name: "View Events", path: "/admin/events" },
        { name: "Create Event", path: "/admin/create-event" },
      ]
    },
    { name: "RSVPs / Attendees", path: "/admin/rsvps", icon: <Users size={20} /> },
    { name: "Notifications", path: "/admin/notifications", icon: <Bell size={20} /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart size={20} /> },
    { name: "Account Settings", path: "/admin/settings", icon: <Settings size={20} /> },
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
          {navItems.map((item, index) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems.includes(item.name);
            const isActive = hasSubItems
              ? item.subItems?.some(sub => location.pathname === sub.path)
              : location.pathname === item.path;

            return (
              <div key={item.name || index}>
                {hasSubItems ? (
                  <button
                    onClick={() => {
                      setExpandedItems(prev =>
                        prev.includes(item.name)
                          ? prev.filter(name => name !== item.name)
                          : [...prev, item.name]
                      );
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left ${
                      isActive
                        ? "bg-[#a18665] text-white"
                        : "text-gray-300 hover:bg-[#a18665]/60 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path!}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#a18665] text-white"
                        : "text-gray-300 hover:bg-[#a18665]/60 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )}

                {/* Sub Items */}
                {hasSubItems && isExpanded && !collapsed && (
                  <div className="ml-6 mt-2 space-y-2">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-sm ${
                            isSubActive
                              ? "bg-[#a18665] text-white"
                              : "text-gray-400 hover:bg-[#a18665]/40 hover:text-white"
                          }`}
                        >
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
