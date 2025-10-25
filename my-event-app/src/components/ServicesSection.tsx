import {
  PartyPopper,
  Heart,
  Briefcase,
  Sparkles,
  ClipboardCheck,
  UserPlus,
} from "lucide-react";
import servicesBg from "../assets/services-bg.png";

export default function ServicesSection() {
  const services = [
    { title: "Birthday Event", icon: PartyPopper, color: "from-yellow-400 to-orange-400" },
    { title: "Wedding", icon: Heart, color: "from-pink-400 to-rose-400" },
    { title: "Corporate Event", icon: Briefcase, color: "from-blue-400 to-cyan-400" },
    { title: "Special Events", icon: Sparkles, color: "from-purple-400 to-pink-400" },
    { title: "Event Coordination", icon: ClipboardCheck, color: "from-green-400 to-emerald-400" },
    { title: "Custom Event", icon: UserPlus, color: "from-indigo-400 to-blue-400" },
  ];

  return (
    <section id="services" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${servicesBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-black/70 text-white rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-bold text-xl">{service.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
