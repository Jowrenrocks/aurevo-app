import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  List,
  User,
  LogOut,
  Menu,
  HelpCircle,
  Bell,
  ChevronDown
} from "lucide-react";

interface DashboardLayoutProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardLayout({ setIsLoggedIn }: DashboardLayoutProps) {
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
    { name: "Dashboard", path: "/user/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Create Event", path: "/user/create-event", icon: <CalendarPlus size={20} /> },
    {
      name: "Event List",
      icon: <List size={20} />,
      subItems: [
        { name: "View My Events", path: "/user/view-events" },
        { name: "Manage Events", path: "/user/events" },
        { name: "RSVPs / Attendees", path: "/user/rsvps" },
      ]
    },
    { name: "Notifications", path: "/user/notifications", icon: <Bell size={20} /> },
    { name: "Profile", path: "/user/profile", icon: <User size={20} /> },
    { name: "Help / Contact", path: "/user/help", icon: <HelpCircle size={20} /> },
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
              Aurévo
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
        className={`flex-1 bg-[#f9f4ef] p-8 overflow-y-auto transition-all duration-300`}
        style={{
          marginLeft: collapsed ? "5rem" : "16rem", // replaces Tailwind dynamic ml-*
        }}
      >
        <div className="bg-[#d9bfa9]/80 rounded-2xl p-6 shadow-lg text-[#2e2e2e]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
