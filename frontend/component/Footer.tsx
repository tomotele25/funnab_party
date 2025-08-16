import React from "react";
import Image from "next/image";
import logo from "../public/logo.png";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            {/* Logo with white background */}
            <div className="w-32 h-16 relative mb-4 bg-white rounded-md p-1">
              <Image src={logo} alt="Logo" fill className="object-contain" />
            </div>
            <p className="text-center md:text-left text-gray-400 max-w-xs">
              Your ultimate party guide. Discover, book, and join the best
              events around you!
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#hero"
                  className="hover:text-purple-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#parties"
                  className="hover:text-purple-500 transition-colors"
                >
                  Parties
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-purple-500 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-purple-500 transition-colors hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-purple-500 transition-colors hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-purple-500 transition-colors hover:scale-110"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Funaab Party. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
