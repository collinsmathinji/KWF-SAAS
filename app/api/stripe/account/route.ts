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
    // In a real app, you would get the connected account ID from your database
    // based on the authenticated user/organization
    const accountId = "acct_123" // Replace with actual account ID

    const account = await stripe.accounts.retrieve(accountId)

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        payoutsEnabled: account.payouts_enabled,
        chargesEnabled: account.charges_enabled,
        detailsSubmitted: account.details_submitted,
      },
    })
  } catch (error) {
    console.error("Error fetching Stripe account:", error)
    return NextResponse.json({ error: "Failed to fetch Stripe account" }, { status: 500 })
  }
}

