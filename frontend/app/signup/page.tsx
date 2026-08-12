"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Loader from "@/component/Loader";
import AuthBrandPanel from "@/component/AuthBrandPanel";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKENDURL}/api/auth/signup`, {
        fullname: fullName,
        email,
        phoneNumber,
        password,
      });
      toast.success(res.data.message || "Account created successfully!");
      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Try again."
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[var(--color-bg)] md:grid-cols-2">
      {/* LEFT BRAND PANEL */}
      <AuthBrandPanel />

      {/* RIGHT FORM */}
      <div className="flex h-full items-center justify-center p-6 sm:p-8">
        <div className="card-surface w-full max-w-md p-8 text-[var(--color-text)]">
          <h1 className="mb-6 text-center text-2xl font-semibold">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-[var(--color-text-muted)]"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="mt-1 block w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--color-text-muted)]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-[var(--color-text-muted)]"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="937-678-987"
                className="mt-1 block w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--color-text-muted)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-aurora w-full py-2 font-medium"
            >
              {loading ? <Loader /> : "Sign Up"}
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-btn)] border border-[var(--color-border)] py-2 transition hover:bg-white/5"
              onClick={() => console.log("Google sign up")}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium text-[var(--color-text)]">
                Continue with Google
              </span>
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--color-accent)] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
