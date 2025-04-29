import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

// Define the user type
interface User {
  id: string;
  email: string;
  username: string;
  userType: string;
  organizationId?: string;
  isOnboarded: boolean;
  accessToken: string;
}

// Extend the default session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      userType: string;
      organizationId?: string;
      isOnboarded: boolean;
      name?: string;
      image?: string;
    };
    accessToken: string;
  }
}

// Extend the default JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    userType: string;
    organizationId?: string;
    isOnboarded: boolean;
    accessToken: string;
  }
}

// Define the auth options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Make sure the API endpoint is correct based on your environment
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          
          const res = await fetch(`${apiUrl}/admin/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.email,
              password: credentials?.password,
            }),
          });
          
          const data = await res.json();
          console.log("Login Response from backend:", data);
          
          if (!res.ok || !data.data?.token) {
            throw new Error(data.message || "Invalid credentials");
          }
          
          // Don't try to use localStorage here as it's server-side
          return {
            id: data.data.id.toString(),
            email: data.data.email,
            username: data.data.username,
            userType: data.data.userType.toString(),
            organizationId: data.data.organizationId?.toString() || "",
            isOnboarded: data.data.isOnboarded || false,
            accessToken: data.data.token,
          } as User;
        } catch (error) {
          console.error("Error during authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - add user properties to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.userType = user.userType;
        token.organizationId = user.organizationId;
        token.isOnboarded = user.isOnboarded;
        token.accessToken = user.accessToken;
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        // Update any fields that are passed in the session update
        if (session.isOnboarded !== undefined) {
          token.isOnboarded = session.isOnboarded;
        }
        if (session.organizationId !== undefined) {
          token.organizationId = session.organizationId;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Add user properties to the session
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          userType: token.userType,
          organizationId: token.organizationId,
          isOnboarded: token.isOnboarded,
        };
        // Store the token in the session for API calls
        session.accessToken = token.accessToken;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // You can add other custom pages here if needed
    // error: '/auth/error',
    // signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-for-development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
};

// Create the handlers for GET and POST requests
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };