import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  try {
    // Initialize Stripe with your secret key
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

    const stripeAccountId = process.env.STRIPE_ACCOUNT_ID

    // Common options for all requests
    const requestOptions: Stripe.RequestOptions = stripeAccountId
      ? { stripeAccount: stripeAccountId }
      : {}

    // Fetch recent charges (payments)
    const charges = await stripeClient.charges.list(
      { limit: 10 },
      requestOptions
    )

    // Fetch recent payouts
    const payouts = await stripeClient.payouts.list(
      { limit: 5 },
      requestOptions
    )

    // Fetch recent refunds
    const refunds = await stripeClient.refunds.list(
      { limit: 5 },
      requestOptions
    )

    // Format charges into transactions
    const paymentTransactions = charges.data.map((charge) => ({
      id: charge.id,
      amount: charge.amount / 100,
      status: charge.status,
      created: charge.created * 1000, // Convert to milliseconds
      customer: {
        name: charge.billing_details.name || "Unknown Customer",
        email: charge.billing_details.email || "",
      },
      currency: charge.currency,
      type: "payment" as const,
    }))

    // Format payouts into transactions
    const payoutTransactions = payouts.data.map((payout) => ({
      id: payout.id,
      amount: payout.amount / 100,
      status: payout.status,
      created: payout.created * 1000, // Convert to milliseconds
      customer: {
        name: "Your Bank Account",
        email: "",
      },
      currency: payout.currency,
      type: "payout" as const,
    }))

    // Format refunds into transactions
    const refundTransactions = refunds.data.map((refund) => ({
      id: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
      created: refund.created * 1000, // Convert to milliseconds
      customer: {
        name: "Refund",
        email: "",
      },
      currency: refund.currency,
      type: "refund" as const,
    }))

    // Combine all transactions and sort by date (newest first)
    const allTransactions = [
      ...paymentTransactions,
      ...payoutTransactions,
      ...refundTransactions,
    ].sort((a, b) => b.created - a.created)

    return NextResponse.json(allTransactions)
  } catch (error) {
    console.error("Error fetching Stripe transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transaction information" },
      { status: 500 }
    )
  }
}
