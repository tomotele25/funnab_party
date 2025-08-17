"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/component/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user?.role) {
      const role = session.user.role;
      if (role === "customer") router.push("/");
      else if (role === "organizer") router.push("/organizer");
      else if (role === "agent") router.push("/agent");
      else router.push("/admin");
    }
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white text-black shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            {loading ? <Loader /> : "Sign Up"}
          </button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
            onClick={() => console.log("Google sign in")}
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-black font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
