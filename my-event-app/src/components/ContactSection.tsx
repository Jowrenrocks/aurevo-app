import { MapPin, Mail, Phone, Clock, Calendar } from "lucide-react";
import contactBg from "../assets/contact-bg.png";

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${contactBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <div className="bg-black/70 text-white rounded-2xl p-10 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-10">
            Planning an event? You can reach us from right here
          </h3>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left side */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <Phone className="w-5 h-5" /> CONTACT US:
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <p className="text-gray-300">
                      Napocor, Tagoloan, Misamis Oriental
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email:</p>
                    <p className="text-gray-300">
                      aruevo.management@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone:</p>
                    <p className="text-gray-300">+63 - 955 - 9048 - 004</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5" /> Business Hours
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Monday-Friday:</p>
                    <p className="text-gray-300">8:00 AM - 8:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Saturday:</p>
                    <p className="text-gray-300">9:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Sunday:</p>
                    <p className="text-gray-300">Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
