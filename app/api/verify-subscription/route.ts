import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
})

export async function POST(request: Request) {
  try {
    const { subscriptionId, customerId } = await request.json()

    if (!subscriptionId && !customerId) {
      return NextResponse.json({ active: false, message: "No subscription or customer ID provided" }, { status: 400 })
    }

    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      const isActive = subscription.status === "active" || subscription.status === "trialing"

      if (!isActive) {
        return NextResponse.json({ active: false, message: "Subscription is not active" }, { status: 400 })
      }

      const customer = await stripe.customers.retrieve(subscription.customer as string)

      return NextResponse.json({
        active: true,
        email: "email" in customer ? customer.email : null,
        customerId: subscription.customer,
      })
    }
    if (customerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      })

      if (subscriptions.data.length === 0) {
        return NextResponse.json(
          { active: false, message: "No active subscriptions found for this customer" },
          { status: 400 },
        )
      }

      // Get customer email
      const customer = await stripe.customers.retrieve(customerId)

      return NextResponse.json({
        active: true,
        email: "email" in customer ? customer.email : null,
        subscriptionId: subscriptions.data[0].id,
      })
    }
  } catch (error: any) {
    console.error("Error verifying subscription:", error)
    return NextResponse.json(
      { active: false, message: error.message || "Failed to verify subscription" },
      { status: 500 },
    )
  }
}

