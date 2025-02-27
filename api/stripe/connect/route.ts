import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
  }

  try {
    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    // Exchange the authorization code for an access token
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    })

    // Store the connected account ID and access token in your database
    // This is just a placeholder - you would implement your database logic here
    const accountId = response.stripe_user_id

    // You may want to save these values in your database
    // const accessToken = response.access_token
    // const refreshToken = response.refresh_token

    return NextResponse.json({
      success: true,
      accountId,
    })
  } catch (error) {
    console.error("Error connecting Stripe account:", error)
    return NextResponse.json({ error: "Failed to connect Stripe account" }, { status: 500 })
  }
}

