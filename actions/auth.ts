import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define the user type
interface CustomUser {
  id: string;
  email: string;
  username: string;
  userType: string;
  organizationId: string | null;
  isOnboarded: boolean;
  accessToken: string;
  rolePermissions?: Array<{ module: string; method: string; endpoint: string }>;
}

// Extend the default session type
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
      rolePermissions?: Array<{ module: string; method: string; endpoint: string }>;
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
    rolePermissions?: Array<{ module: string; method: string; endpoint: string }>;
  }
}

// Extend the default JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    userType: string;
    organizationId: string | null;
    isOnboarded: boolean;
    accessToken: string;
    rolePermissions?: Array<{ module: string; method: string; endpoint: string }>;
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
          const apiUrl = process.env.API_URL || 'http://localhost:5000';
          
          const res = await fetch(`${apiUrl}/admin/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.email,
              password: credentials?.password,
            }),
          });
          
          const data = await res.json();
          console.log("=== AUTH DEBUG START ===");
          console.log("Raw API Response:", {
            status: res.status,
            ok: res.ok,
            data: JSON.stringify(data, null, 2)
          });
          
          if (!res.ok || !data.data?.token) {
            throw new Error(data.message || "Invalid credentials");
          }

          // Log the exact data structure we're working with
          console.log("User Data Structure:", {
            id: data.data.id,
            email: data.data.email,
            isOnboarded: {
              value: data.data.isOnboarded,
              type: typeof data.data.isOnboarded,
              rawValue: data.data.isOnboarded
            }
          });

          // Explicitly check the isOnboarded value
          const rawIsOnboarded = data.data.isOnboarded;
          const isOnboarded = rawIsOnboarded === 1 || rawIsOnboarded === '1' || rawIsOnboarded === true;
          
          console.log("IsOnboarded Conversion:", {
            raw: rawIsOnboarded,
            rawType: typeof rawIsOnboarded,
            converted: isOnboarded
          });
          console.log("=== AUTH DEBUG END ===");
          
          // Return user object with explicit conversion
          return {
            id: data.data.id.toString(),
            email: data.data.email,
            username: data.data.username,
            userType: data.data.userType.toString(),
            organizationId: data.data.organizationId?.toString() || null,
            isOnboarded: data.data.isOnboarded,
            accessToken: data.data.token,
            rolePermissions: data.data.rolePermissions || []
          };
        } catch (error) {
          console.error("Login Error:", {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
          });
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - add user properties to token
      if (user) {
        console.log("Setting initial JWT token from user:", {
          user,
          userType: typeof user.isOnboarded,
          isOnboardedValue: user.isOnboarded
        });
        
        token.id = user.id;
        token.email = user.email;
        token.userType = (user as CustomUser).userType;
        token.organizationId = (user as CustomUser).organizationId;
        // Ensure boolean conversion
        token.isOnboarded = Boolean((user as CustomUser).isOnboarded);
        token.accessToken = (user as CustomUser).accessToken;
        token.rolePermissions = (user as CustomUser).rolePermissions;
        
        console.log("Token after user data set:", {
          tokenIsOnboarded: token.isOnboarded,
          tokenIsOnboardedType: typeof token.isOnboarded
        });
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        console.log("Updating JWT token from session:", {
          session,
          sessionIsOnboardedType: typeof session.isOnboarded
        });
        
        // Update any fields that are passed in the session update
        if (session.isOnboarded !== undefined) {
          // Ensure boolean conversion
          token.isOnboarded = Boolean(session.isOnboarded);
        }
        if (session.organizationId !== undefined) {
          token.organizationId = session.organizationId;
        }
      }
      
      console.log("Final JWT token state:", {
        tokenIsOnboarded: token.isOnboarded,
        tokenIsOnboardedType: typeof token.isOnboarded
      });
      return token;
    },
    async session({ session, token }) {
      // Add user properties to the session
      if (token) {
        console.log("Creating session from token:", {
          token,
          tokenIsOnboardedType: typeof token.isOnboarded,
          tokenIsOnboardedValue: token.isOnboarded
        });
        
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          userType: token.userType,
          organizationId: token.organizationId,
          isOnboarded: token.isOnboarded,
          rolePermissions: token.rolePermissions,
        };
        // Store the token in the session for API calls
        session.accessToken = token.accessToken;
        
        console.log("Final session state:", {
          sessionUser: session.user,
          sessionIsOnboardedType: typeof session.user.isOnboarded,
          sessionIsOnboardedValue: session.user.isOnboarded
        });
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // You can add other custom pages here if needed
    error: '/login', // This redirects to login page with error param
  },
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-for-development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
};