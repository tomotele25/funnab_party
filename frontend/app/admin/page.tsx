"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    router.push("/login");
    toast.success("You’ve been logged out");
    setLoading(false);
  };
  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`px-4 py-2 rounded transition ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default LogoutButton;
