import { Button } from "./button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Header({ onNavigate, activeSection }: HeaderProps) {
  const navigate = useNavigate();

  const navItems = [
    { id: "about", label: "About us" },
    { id: "contact", label: "Contact" },
    { id: "values", label: "Core Values" },
    { id: "services", label: "Our Services" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-green-400 to-cyan-400 p-0.5">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <div className="text-white text-xs font-bold text-center">
                <div className="text-[10px] leading-tight">AURÉVO</div>
                <div className="text-[6px] leading-tight">EVENT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="text-white/90 hover:text-white text-sm font-medium relative group transition-colors"
              data-testid={`link-${item.id}`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-green-400 transition-all ${
                  activeSection === item.id
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-white hover:text-white"
            data-testid="button-login"
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
          <Button
            className="bg-gradient-to-r from-yellow-400 to-green-400 text-black hover:opacity-90 border-0"
            data-testid="button-signup"
            onClick={() => navigate("/signup")} // ✅ added this
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
