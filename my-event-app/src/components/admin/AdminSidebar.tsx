import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function AdminSidebar() {
  const navItems = [
    { name: "DASHBOARD", path: "/admin/dashboard" },
    { name: "VIEW EVENTS", path: "/admin/events" },
    { name: "PENDING PAYMENT", path: "/admin/payments" },
  ];

  return (
    <aside className="bg-[#cbb88b] min-h-screen w-64 flex flex-col items-center pt-6">
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="logo" className="w-20 h-20 rounded-full mb-2" />
      </div>

      <nav className="w-full px-4 space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block text-center py-3 rounded-xl font-semibold ${
                isActive ? "bg-[#e8cf94] text-black shadow-md" : "bg-white text-black"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
