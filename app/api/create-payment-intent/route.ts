
import { NextResponse } from "next/server"
import Stripe from "stripe"
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.log("stripesecret", stripeSecretKey)
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY")
} else {
  console.log("✅ STRIPE_SECRET_KEY is present:", stripeSecretKey)
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-01-27.acacia",
  typescript: true,
})



export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
  }

  try {
    const { planId, amount } = await req.json()

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        planId,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Error creating payment intent" }, { status: 500 })
  }
}

