import Image from "next/image";
import logo from "../public/2.png";

const AuthBrandPanel = () => {
  return (
    <div className="hidden md:flex flex-col h-full bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,128,0.25),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,255,0.2),transparent)]" />

      <div className="flex-1 flex flex-col items-center justify-center p-10 relative z-10">
        <div className="w-full max-w-xs relative aspect-square rounded-2xl bg-white p-4 shadow-2xl">
          <Image
            src={logo}
            alt="Funaab Party logo"
            fill
            className="object-contain p-2"
            priority
            sizes="320px"
          />
        </div>
        <p className="mt-8 text-center text-gray-300 max-w-xs">
          Discover, book, and join the best parties around FUNAAB.
        </p>
      </div>

      <div className="relative z-10 pb-8 text-center text-sm text-gray-500">
        Powered by <span className="font-semibold text-gray-300">Chowspace</span>
      </div>
    </div>
  );
};

export default AuthBrandPanel;
