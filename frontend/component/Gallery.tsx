"use client";
import React from "react";

const images = [
  "/Hero (1).jpg",
  "/Hero (1).jpg",
  "/Hero (1).jpg",
  "/Hero (1).jpg",
  "/Hero (1).jpg",
  "/Hero (1).jpg",
];

const Gallery = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Page Header */}
      <div className="py-10 text-center">
        <h1 className="text-4xl font-bold">Party Gallery</h1>
        <p className="mt-2 text-gray-600">
          Relive the moments from our past events
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={src}
              alt={`Party ${idx + 1}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 py-6 border-t">
        &copy; {new Date().getFullYear()} Party Vibes. All rights reserved.
      </div>
    </div>
  );
};

export default Gallery;
