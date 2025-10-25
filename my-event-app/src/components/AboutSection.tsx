import aboutBg from "../assets/about-bg.png";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${aboutBg})`,
        }}
      >
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-black/70 text-white rounded-2xl p-10 shadow-2xl">
          <p className="text-lg md:text-xl leading-relaxed text-center">
            Our event management platform is designed to bring everything you
            need into one place. Whether it's a Birthday, Wedding, Corporate
            Event, or Any Special Celebration, we're here to make planning
            easier, smoother, and stress-free.
          </p>
        </div>
      </div>
    </section>
  );
}
