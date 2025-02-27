import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
} else {
  console.log("✅ STRIPE_SECRET_KEY is present:", stripeSecretKey)
}

// Initialize Stripe with the latest API version
const stripeClient = new Stripe(stripeSecretKey, {
  apiVersion: "2025-01-27.acacia", // Updated to latest stable version
  typescript: true,
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 })
    }

    // Exchange the authorization code for an access token
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    })

    // Get the connected account ID
    const connectedAccountId = response.stripe_user_id

    // Store this connectedAccountId in your database associated with the organization
    // For this example, we'll just return it
    return NextResponse.json({
      success: true,
      accountId: connectedAccountId,
    })
  } catch (error) {
    console.error("Error connecting Stripe account:", error)
    return NextResponse.json({ error: "Failed to connect Stripe account" }, { status: 500 })
  }
}

