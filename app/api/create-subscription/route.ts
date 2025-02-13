import { PLANS } from "../stripe/config"
import Stripe from "stripe"
import { NextResponse } from "next/server"

// Environment variable check
const stripeSecretKey = process.env.NEXT_STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing NEXT_STRIPE_SECRET_KEY environment variable");
} else {
  console.log("✅ STRIPE_SECRET_KEY is present:", stripeSecretKey);
}

// Initialize Stripe with the latest API version
const stripeClient = new Stripe(stripeSecretKey, {
  apiVersion: "2025-01-27.acacia", 
  typescript: true,
})

export async function POST(req: Request) {
  try {
    console.log("⏳ Receiving subscription request...")
    
    const { planId } = await req.json()
    console.log("✅ Received Plan ID:", planId)

    const plan = PLANS[planId as keyof typeof PLANS]

    if (!plan || !plan.priceId) {
      console.error("❌ Invalid Plan Selected:", planId)
      return NextResponse.json(
        { error: "Invalid plan selected" }, 
        { status: 400 }
      )
    }

    // Ensure Stripe is initialized
    if (!stripeClient) {
      console.error("❌ Stripe is not initialized!")
      return NextResponse.json(
        { error: "Stripe is not initialized" }, 
        { status: 500 }
      )
    }

    console.log("✅ Creating subscription for Plan:", plan.priceId)

    // Create a customer first if you don't have one
    // In a real application, this should be tied to your user system
    const customer = await stripeClient.customers.create({
      metadata: {
        planId: plan.id,
      },
    })

    const subscription = await stripeClient.subscriptions.create({
      customer: customer.id,
      payment_behavior: "default_incomplete",
      items: [{ price: plan.priceId }],
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        planId: plan.id,
      },
    })

    console.log("✅ Subscription created successfully:", subscription.id)

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const payment_intent = invoice.payment_intent as Stripe.PaymentIntent

    if (!payment_intent?.client_secret) {
      throw new Error("No client secret found in payment intent")
    }

    console.log("✅ Payment Intent retrieved:", payment_intent.client_secret)

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: payment_intent.client_secret,
    })
  } catch (error) {
    console.error("🚨 Error creating subscription:", error)
    
    // Provide more detailed error messages in development
    const errorMessage = process.env.NODE_ENV === "development" 
      ? (error as Error).message 
      : "Error creating subscription"

    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    )
  }
}
