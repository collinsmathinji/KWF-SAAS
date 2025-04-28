// types/next-auth.d.ts
// Place this file in a "types" directory at the root of your project

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      userType: string;
      organizationId: string;
      isOnBoarded: boolean;
      name?: string | null;
      image?: string | null;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    username: string;
    userType: string;
    organizationId: string;
    isOnBoarded: boolean;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    userType: string;
    organizationId: string;
    isOnBoarded: boolean;
    accessToken: string;
  }
}