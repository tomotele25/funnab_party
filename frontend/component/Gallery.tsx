"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageData {
  src: string;
  alt: string;
}

const Gallery: React.FC = () => {
  const images: ImageData[] = [
    { src: "/Hero (1).jpg", alt: "Party 1" },
    { src: "/Hero (1).jpg", alt: "Party 2" },
    { src: "/Hero (1).jpg", alt: "Party 3" },
    { src: "/Hero (1).jpg", alt: "Party 4" },
    { src: "/Hero (1).jpg", alt: "Party 5" },
    { src: "/Hero (1).jpg", alt: "Party 6" },
  ];

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const slidesToShow = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isTransitioning, images.length]);

  // Handle manual slide change
  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* background neon blur */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,0,128,0.3),_transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,255,255,0.3),_transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent)]" />

      {/* Page Header */}
      <div className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide drop-shadow-lg text-pink-300">
          Party Gallery
        </h1>
        <p className="mt-4 text-lg md:text-xl text-cyan-300">
          Relive your moments from yesterday’s party (August 16, 2025)!
        </p>
      </div>

      {/* Gallery Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                currentSlide * (100 / slidesToShow())
              }%)`,
              width: `${(images.length / slidesToShow()) * 100}%`,
            }}
          >
            {images.map((image, idx) => (
              <div
                key={idx}
                className="w-full flex-shrink-0 px-2"
                style={{ width: `${100 / slidesToShow()}%` }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg glow-effect hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={256}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-cyan-300 px-2 py-1 rounded text-sm">
                    Taken: August 16, 2025
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({
              length: Math.ceil(images.length / slidesToShow()),
            }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx * slidesToShow())}
                className={`w-3 h-3 rounded-full ${
                  Math.floor(currentSlide / slidesToShow()) === idx
                    ? "bg-pink-500"
                    : "bg-gray-500"
                } hover:bg-pink-300 transition-colors duration-200`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="text-center py-10">
        <p className="text-lg md:text-xl text-cyan-300 mb-4">
          Share your party pics with us!
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 shadow-lg glow-button">
          Upload Your Moment
        </button>
      </div>

      <style jsx>{`
        .glow-effect {
          box-shadow: 0 0 10px rgba(255, 0, 128, 0.5),
            0 0 20px rgba(0, 255, 255, 0.5);
        }
        .glow-effect:hover {
          box-shadow: 0 0 15px rgba(255, 0, 128, 0.7),
            0 0 25px rgba(0, 255, 255, 0.7);
        }
        .glow-button {
          box-shadow: 0 0 10px rgba(255, 0, 128, 0.3),
            0 0 20px rgba(0, 255, 255, 0.3);
        }
        .glow-button:hover {
          box-shadow: 0 0 15px rgba(255, 0, 128, 0.5),
            0 0 25px rgba(0, 255, 255, 0.5);
        }
        @media (max-width: 639px) {
          img {
            height: 40vh;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          img {
            height: 50vh;
          }
        }
        @media (min-width: 1024px) {
          img {
            height: 60vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Gallery;
