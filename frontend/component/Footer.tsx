import React from "react";
import Image from "next/image";
import logo from "../public/logo.jpg";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-20 relative overflow-hidden">
      {/* Background Neon Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,128,0.2),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,255,0.2),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            {/* Logo with Neon Glow */}
            <div className="w-32 h-16 relative mb-4 rounded-md p-1 bg-white/10 backdrop-blur-sm glow-effect">
              <Image src={logo} alt="Logo" fill className="object-contain" />
            </div>
            <p className="text-center md:text-left text-gray-400 max-w-xs text-sm">
              Your ultimate party guide. Discover, book, and join the best
              events around you!
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-extrabold text-xl mb-3 text-pink-500">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#hero"
                  className="hover:text-pink-500 transition-all duration-300 hover:scale-105 glow-effect text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#parties"
                  className="hover:text-pink-500 transition-all duration-300 hover:scale-105 glow-effect text-sm"
                >
                  Parties
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-pink-500 transition-all duration-300 hover:scale-105 glow-effect text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-extrabold text-xl mb-3 text-cyan-500">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-all duration-300 hover:scale-110 glow-effect"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-all duration-300 hover:scale-110 glow-effect"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-all duration-300 hover:scale-110 glow-effect"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 mt-12 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Funaab Party. All rights reserved.
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .glow-effect:hover {
          box-shadow: 0 0 15px rgba(255, 0, 128, 0.5);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
