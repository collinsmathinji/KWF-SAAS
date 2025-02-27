import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable")
    } else {
      console.log("✅ STRIPE_SECRET_KEY is present:", stripeSecretKey)
    }
    
    // Initialize Stripe with the latest API version
    const stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia", // Updated to latest stable version
      typescript: true,
    })

    // Fetch the connected account's balance
    const balance = await stripeClient.balance.retrieve({
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

