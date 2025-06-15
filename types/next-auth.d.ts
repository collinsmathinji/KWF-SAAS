import NextAuth from "next-auth";
import { Permission } from "@/types/permissions";

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
      rolePermissions?: Permission[];
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
    rolePermissions?: Permission[];
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
    rolePermissions?: Permission[];
  }
} 