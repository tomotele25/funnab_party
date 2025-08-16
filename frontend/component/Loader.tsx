// Loader.tsx
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
