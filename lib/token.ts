"use server"

import { cookies } from "next/headers"

export interface SignupData {
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    [key: string]: any
  }
}

// Helper to get the base URL for server-side fetches
function getBaseUrl() {
  // In production, use the VERCEL_URL environment variable
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // In development, use localhost
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

export async function setAuthCookie(token: string) {
  ;(await cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

export async function storeAuthToken(token: string) {
  await setAuthCookie(token)
  console.log("Token stored in cookie:", token)
  return { success: true }
}

export async function signup({ email, password }: SignupData): Promise<AuthResponse> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Signup failed")
    }

    // Call the server action to store the token
    if (data.token) {
      await storeAuthToken(data.token)
    }

    return data
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

export async function login({ email, password }: LoginData): Promise<AuthResponse> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/proxy/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    // Call the server action to store the token
    if (data.token) {
      await storeAuthToken(data.token)
    }

    return data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export async function logout() {
  ;(await cookies()).delete("auth-token")
  return { success: true }
}

export async function getAuthToken() {
  return (await cookies()).get("auth-token")?.value
}

export async function isAuthenticated() {
  return !!(await cookies()).get("auth-token")?.value
}
