"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/component/Loader";
import AuthBrandPanel from "@/component/AuthBrandPanel";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    if (session.user.role === "admin") router.push("/admin");
    else if (session.user.hasEvents) router.push("/organizer");
    else router.push("/customer");
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        console.error("Login failed:", res.error);
        toast.error(res?.error || "Invalid email or password");
      } else {
        toast.success("Login successfully");
      }
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
      <AuthBrandPanel />

      <div className="flex items-center justify-center p-6">
        <div className="card-surface w-full max-w-sm p-8 text-[var(--color-text)]">
          <h1 className="mb-6 text-center text-2xl font-semibold">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? <Loader /> : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-btn)] border border-[var(--color-border)] py-2 transition hover:bg-white/5"
              onClick={() => signIn("google")}
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
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[var(--color-accent)] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
