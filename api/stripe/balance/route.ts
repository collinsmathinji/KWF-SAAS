import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  try {
    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    // Fetch the connected account's balance
    const balance = await stripe.balance.retrieve({
      stripeAccount: process.env.STRIPE_ACCOUNT_ID, // Optional: If you're using Connect
    })

    // Format the response
    const formattedBalance = {
      available: balance.available.reduce((sum, item) => sum + item.amount, 0) / 100,
      pending: balance.pending.reduce((sum, item) => sum + item.amount, 0) / 100,
      currency: balance.available[0]?.currency || "usd",
    }

    return NextResponse.json(formattedBalance)
  } catch (error) {
    console.error("Error fetching Stripe balance:", error)
    return NextResponse.json({ error: "Failed to fetch balance information" }, { status: 500 })
  }
}

