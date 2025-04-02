import { stripe } from "../stripe/stripehook"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
  }

  try {
    console.log("⏳ Receiving subscription request...")

    const { priceId, customerName, customerEmail } = await req.json()
    console.log("✅ Received Price ID:", priceId)
    console.log("✅ Customer Info:", { name: customerName, email: customerEmail })

    // Create a customer with the provided information
    const customer = await stripe.customers.create({
      name: customerName,
      email: customerEmail,
      metadata: {
        source: "website_subscription",
      },
    })

    console.log("✅ Customer created:", customer.id)

    // Create a subscription for the customer
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      payment_behavior: "default_incomplete",
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    })

    console.log("✅ Subscription created successfully:", subscription.id)

    const invoice = subscription.latest_invoice as any
    const payment_intent = invoice.payment_intent as any

    if (!payment_intent?.client_secret) {
      throw new Error("No client secret found in payment intent")
    }

    console.log("✅ Payment Intent retrieved:", payment_intent.client_secret)

    return NextResponse.json({
      subscriptionId: subscription.id,
      customerId: customer.id,
      clientSecret: payment_intent.client_secret,
    })
  } catch (error) {
    console.error("🚨 Error creating subscription:", error)

    const errorMessage =
      process.env.NODE_ENV === "development" ? (error as Error).message : "Error creating subscription"

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

