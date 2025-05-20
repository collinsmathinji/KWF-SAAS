import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      userType: string;
      organizationId: string | null;
      isOnboarded: boolean;
      name?: string;
      image?: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    username: string;
    userType: string;
    organizationId: string | null;
    isOnboarded: boolean;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    userType: string;
    organizationId: string | null;
    isOnboarded: boolean;
    accessToken: string;
  }
} 