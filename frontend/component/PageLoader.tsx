"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader on path change
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // optional delay for smooth fade

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/70 backdrop-blur-sm">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent shadow-[var(--shadow-glow-primary)]" />
    </div>
  );
}
