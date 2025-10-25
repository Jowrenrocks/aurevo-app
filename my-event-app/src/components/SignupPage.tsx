import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import bg from "../assets/signup-bg.png";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      alert("Account created successfully!");
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed. Try again.");
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
        backgroundPosition: "center",
      }}
    >
     

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between p-8">
        {/* LEFT SIDE - Logo and text */}
        <div className="flex flex-col items-center justify-center text-center md:w-1/2 mb-10 md:mb-0 text-white">
          <img src={logo} alt="Aurévo Logo" className="w-24 h-24 object-contain mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">EVENT MANAGEMENT</h1>
          <p className="text-white text-lg leading-relaxed max-w-sm">
            Wedding Event, Birthday Event, Corporate Events, Event Coordination, etc.
          </p>
        </div>

        {/* RIGHT SIDE - Signup form box */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-md w-full md:w-1/2 max-w-md">
          <h2 className="text-2xl font-semibold text-[#6b5536] mb-6 text-center">
            Sign Up
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[#6b5536] font-medium mb-1">Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#a18665] focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>

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

            <div>
              <label className="block text-[#6b5536] font-medium mb-1">
                Confirm Password:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#a18665] focus:outline-none"
                placeholder="Re-enter your password"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-[#a18665] hover:bg-[#8a7452] text-white font-semibold py-2 rounded-xl transition"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            {/* Login redirect link */}
            <p className="text-center text-[#6b5536] mt-4">
              Already have an account?{" "}
              <span
                className="font-semibold underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
