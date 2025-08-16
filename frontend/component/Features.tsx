import React from "react";
import {
  Ticket,
  MapPin,
  ClipboardList,
  Crown,
  Camera,
  Mic2,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Ticket className="w-10 h-10 text-pink-400 animate-bounce-slow" />,
      title: "Easy Ticket Purchase",
      description:
        "Secure your spot at the hottest parties in seconds — no queues, no stress.",
    },
    {
      icon: (
        <MapPin className="w-10 h-10 text-cyan-400 animate-bounce-slow delay-100" />
      ),
      title: "Discover Parties Near You",
      description:
        "Find trending events and secret raves happening right in your city or campus.",
    },
    {
      icon: (
        <ClipboardList className="w-10 h-10 text-purple-400 animate-bounce-slow delay-200" />
      ),
      title: "RSVP & Guest List",
      description:
        "Get your name on the VIP list before the night begins — be the one they let in first.",
    },
    {
      icon: (
        <Crown className="w-10 h-10 text-yellow-400 animate-bounce-slow delay-300" />
      ),
      title: "VIP Access & Packages",
      description:
        "Upgrade to VIP for bottle service, private lounges, and front-row action.",
    },
    {
      icon: (
        <Camera className="w-10 h-10 text-fuchsia-400 animate-bounce-slow delay-400" />
      ),
      title: "Event Highlights",
      description:
        "Relive epic moments with high-quality after-party photos and videos.",
    },
    {
      icon: (
        <Mic2 className="w-10 h-10 text-green-400 animate-bounce-slow delay-500" />
      ),
      title: "Host Your Own Event",
      description:
        "Throw your own party and manage everything from tickets to guest lists.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* background neon blur */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,0,128,0.2),_transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,255,255,0.2),_transparent)]" />

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Why Party With Us?
        </h2>
        <p className="text-gray-400 mb-14 max-w-2xl mx-auto text-lg">
          Not just a ticket — your all-access pass to unforgettable nights,
          electric vibes, and legendary memories.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all hover:scale-105 hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(255,0,128,0.6)]"
            >
              <div className="mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>

              {/* neon hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl -z-10" />
            </div>
          ))}
        </div>
      </div>

      {/* slow bounce animation */}
      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
