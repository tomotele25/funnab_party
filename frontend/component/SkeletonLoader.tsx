import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen space-y-6 bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] animate-pulse sm:px-8 md:px-16">
      {/* Back Button */}
      <div className="h-6 w-40 rounded bg-[var(--color-surface)]" />

      {/* Event Banner */}
      <div className="h-64 w-full rounded-[var(--radius-card)] bg-[var(--color-surface)] sm:h-80 md:h-96" />

      {/* Event Details */}
      <div className="space-y-2">
        <div className="h-10 w-3/4 rounded bg-[var(--color-surface)]" />
        <div className="h-6 w-1/2 rounded bg-[var(--color-surface)]" />
        <div className="h-4 w-full rounded bg-[var(--color-surface)]" />
        <div className="h-4 w-2/3 rounded bg-[var(--color-surface)]" />
      </div>

      {/* Ticket Selection */}
      <div className="space-y-4">
        <div className="h-8 w-1/3 rounded bg-[var(--color-surface)]" />
        {[1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="flex h-20 w-full items-center justify-between rounded-[var(--radius-card)] bg-[var(--color-surface)] p-4"
          >
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-[var(--color-surface-2)]" />
              <div className="h-3 w-12 rounded bg-[var(--color-surface-2)]" />
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="h-4 w-16 rounded bg-[var(--color-surface-2)]" />
              <div className="h-6 w-24 rounded bg-[var(--color-surface-2)]" />
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Summary */}
      <div className="mt-6 h-32 w-full rounded-[var(--radius-card)] bg-[var(--color-surface)]" />
    </div>
  );
};

export default SkeletonLoader;
