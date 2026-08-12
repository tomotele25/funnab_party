import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullname: string;
      role: string;
      isOrganizer: boolean;
      hasEvents: boolean;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    fullname: string;
    role: string;
    isOrganizer: boolean;
    hasEvents: boolean;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fullname: string;
    role: string;
    isOrganizer: boolean;
    hasEvents: boolean;
    accessToken: string;
  }
}
