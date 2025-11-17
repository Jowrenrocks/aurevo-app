import React from "react";
import backgroundImage from "../assets/hero-bg.png";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-center bg-cover overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center px-6">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-yellow-400 via-green-400 to-cyan-400 p-1 shadow-[0_0_60px_rgba(250,204,21,0.4)]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl md:text-4xl font-bold tracking-wider">
                    AURÉVO
                  </div>
                  <div className="text-xs md:text-sm tracking-widest mt-1">
                    EVENT MANAGEMENT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
          AURÉVO
        </h1>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-8 tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
          EVENT MANAGEMENT
        </h2>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
          Make every occasion unforgettable with Aurévo!
        </p>
      </div>
    </section>
  );
}
