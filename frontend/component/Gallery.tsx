import React from "react";

const Gallery = () => {
  const images = [
    "/Hero.png",
    "/Hero.png",
    "/Hero.png",
    "/Hero.png",
    "/Hero.png",
    "/Hero.png",
  ];

  return (
    <div className="w-full bg-white py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-black">
        Our Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <img
              src={src}
              alt={`Gallery ${index + 1}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
