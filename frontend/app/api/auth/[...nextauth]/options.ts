import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
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
              isOrganizer: !!user.isOrganizer,
              hasEvents: !!user.hasEvents,
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
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await axios.post(`${BACKENDURL}/api/auth/google`, {
            idToken: account.id_token,
          });

          if (res.data.success && res.data.user) {
            const backendUser = res.data.user;
            token.id = backendUser.id;
            token.fullname = backendUser.fullname;
            token.role = backendUser.role;
            token.isOrganizer = backendUser.isOrganizer;
            token.hasEvents = backendUser.hasEvents;
            token.accessToken = res.data.accessToken;
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Google auth error:", error.message);
          }
        }
        return token;
      }

      if (user) {
        token.id = user.id;
        token.fullname = user.fullname;
        token.role = user.role;
        token.isOrganizer = user.isOrganizer;
        token.hasEvents = user.hasEvents;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.fullname = token.fullname as string;
        session.user.role = token.role as string;
        session.user.isOrganizer = token.isOrganizer as boolean;
        session.user.hasEvents = token.hasEvents as boolean;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};
