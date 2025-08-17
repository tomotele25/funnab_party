import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8 md:px-16 py-8 space-y-6 animate-pulse">
      {/* Back Button */}
      <div className="h-6 w-40 bg-gray-700 rounded" />

      {/* Event Banner */}
      <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-800 rounded-xl" />

      {/* Event Details */}
      <div className="space-y-2">
        <div className="h-10 w-3/4 bg-gray-700 rounded" />
        <div className="h-6 w-1/2 bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-700 rounded" />
        <div className="h-4 w-2/3 bg-gray-700 rounded" />
      </div>

      {/* Ticket Selection */}
      <div className="space-y-4">
        <div className="h-8 w-1/3 bg-gray-700 rounded" />
        {[1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="h-20 w-full bg-gray-800 rounded-lg flex justify-between items-center p-4"
          >
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-700 rounded" />
              <div className="h-3 w-12 bg-gray-700 rounded" />
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <div className="h-4 w-16 bg-gray-700 rounded" />
              <div className="h-6 w-24 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Summary */}
      <div className="h-32 w-full bg-gray-800 rounded-lg mt-6" />
    </div>
  );
};

export default SkeletonLoader;
