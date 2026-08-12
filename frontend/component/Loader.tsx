import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-4 border-t-transparent border-[var(--color-accent)]" />
    </div>
  );
};

export default Loader;
