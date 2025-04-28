// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

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
          const res = await fetch(`http://localhost:5000/admin/auth/login`, {
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
          
          // Return user data with consistent property names
          return {
            id: data.data.id.toString(),
            email: data.data.email,
            username: data.data.username,
            userType: data.data.userType.toString(),
            organizationId: data.data.organizationId?.toString() || "",
            isOnBoarded: data.data.isOnboarded || false,  // Convert from isOnboarded to isOnBoarded
            accessToken: data.data.token,
          };
        } catch (error) {
          console.error("Error during authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("User data in jwt callback:", user);
        token.id = user.id;
        token.email = user.email;
        token.userType = user.userType;
        token.organizationId = user.organizationId;
        token.isOnBoarded = user.isOnBoarded;
        token.accessToken = user.accessToken;
      }
      console.log("JWT Token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session in callback:", session);
      
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.userType = token.userType as string;
        session.user.organizationId = token.organizationId as string;
        session.user.isOnBoarded = token.isOnBoarded as boolean;
        session.accessToken = token.accessToken as string;
      }
      
      console.log("Updated Session:", session);
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-for-development",
};

// Create the handlers for GET and POST requests - REMOVING DEFAULT EXPORT
const handler = NextAuth(authOptions);
// This is the correct way to export handlers for App Router
export { handler as GET, handler as POST };