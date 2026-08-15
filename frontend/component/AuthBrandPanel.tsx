import Image from "next/image";
import logo from "../public/2.png";

const AuthBrandPanel = () => {
  return (
    <div className="relative hidden h-full flex-col overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)] md:flex">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.3),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.25),transparent_60%)]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-10">
        <div className="relative aspect-square w-full max-w-xs rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-glow-primary)]">
          <Image
            src={logo}
            alt="FUNAAB Party logo"
            fill
            className="object-contain p-2 grayscale"
            priority
            sizes="320px"
          />
        </div>
        <p className="mt-8 max-w-xs text-center text-[var(--color-text-muted)]">
          Discover, book, and join the best parties around FUNAAB.
        </p>
      </div>

      <div className="relative z-10 pb-8 text-center text-sm text-[var(--color-text-muted)]">
        Powered by <span className="font-semibold text-[var(--color-text)]">Chowspace</span>
      </div>
    </div>
  );
};

export default AuthBrandPanel;
