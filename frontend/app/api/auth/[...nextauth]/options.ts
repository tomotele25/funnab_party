import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { AxiosError } from "axios";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "http://localhost:2005";
export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) return null;

        try {
          const res = await axios.post(`${BACKENDURL}/api/auth/login`, {
            email,
            password,
          });

          const user = res.data.user;
          const accessToken = res.data.accessToken;

          if (res.data.success && user) {
            return {
              id: user.id,
              email: user.email,
              fullname: user.fullname,
              role: user.role,
              accessToken,
            };
          }

          return null;
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Auth error:", error.message);
          }
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullname = user.fullname;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.fullname = token.fullname as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};
