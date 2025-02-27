import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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

