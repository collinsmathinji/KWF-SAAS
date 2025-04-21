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
export async function storeUserType(userType: number) {
  ;(await cookies()).set("user-type", userType.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}
export async function checkUserType() {
  const userType = (await cookies()).get("user-type")?.value
  if (!userType) {
    return { success: false, userType: null }
  }
if(userType=== '2') {
  return { success: true, userType: 'admin' }
} else if (userType === '1') {
  return { success: true, userType: 'user' }
}
}
export async function storeAuthToken(token: string) {
  await setAuthCookie(token)
  console.log("Token stored in cookie:", token)
  return { success: true }
}


