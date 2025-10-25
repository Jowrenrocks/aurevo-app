import coreValuesBg from "../assets/corevalues-bg.png";

export default function CoreValuesSection() {
  const values = [
    {
      title: "MISSION",
      description:
        "To transform event planning into a seamless, innovative, and inspiring experience that empowers organizers and delights attendees.",
    },
    {
      title: "VISION",
      description:
        "To reimagine event management as more than organization—creating a world where every celebration feels effortless, meaningful, and timeless.",
    },
    {
      title: "PHILOSOPHY",
      description:
        "At Aurévo, we believe every event is a journey. With the right blend of technology and creativity, ordinary moments can evolve into extraordinary memories.",
    },
  ];

  return (
    <section id="values" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${coreValuesBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-black/70 text-white rounded-2xl p-8 shadow-2xl"
            >
              <h3 className="font-serif text-2xl font-bold mb-6 text-center">
                {value.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-center">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
