"use client"

import { storeAuthToken } from "./token"

export interface SignupData {
  name: string
  password: string
  token?: string
}

export interface LoginData {
  username: string
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
export async function signup({ name, password,token }: SignupData): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/completeSignUp", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password,token }),
    })

    const data = await response.json()
   await  console.log("Signup response:", data)
    if (!response.ok) {
      throw new Error(data.message || "Signup failed")
    }

  
  

    return data
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

// Client-side version of login
export async function login({ username, password }: LoginData): Promise<AuthResponse> {
  try {
    // Client-side fetch can use relative URLs
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  username, password }),
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
