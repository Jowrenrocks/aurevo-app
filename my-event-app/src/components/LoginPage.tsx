import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // ✅ Uses axios baseURL helper
import { setAuthToken } from "../utils/api"; // ✅ Adds token after login
import logo from "../assets/logo.png";
import bg from "../assets/login-bg.png";

interface LoginPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginPage({ setIsLoggedIn }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      if (token) {
        // Save token and attach it to axios
        localStorage.setItem("token", token);
        setAuthToken(token);
        setIsLoggedIn(true);
        alert("Login successful!");
        navigate("/events");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between p-8">
        {/* LEFT SIDE */}
        <div className="flex flex-col items-center justify-center text-center md:w-1/2 mb-10 md:mb-0">
          <img src={logo} alt="Aurévo Logo" className="w-24 h-24 object-contain mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">EVENT MANAGEMENT</h1>
          <p className="text-white text-lg leading-relaxed max-w-sm">
            Wedding Event, Birthday Event, Corporate Events, Event Coordination, etc.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-md w-full md:w-1/2 max-w-md">
          <h2 className="text-2xl font-semibold text-[#6b5536] mb-6 text-center">Log In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#6b5536] font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#a18665] focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-[#6b5536] font-medium mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#a18665] focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#a18665] hover:bg-[#8a7452] text-white font-semibold py-2 rounded-xl transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center text-[#6b5536] mt-4">
              Don’t have an account?{" "}
              <span
                className="font-semibold underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
