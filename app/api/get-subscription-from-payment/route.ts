import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
})

export async function POST(request: Request) {
  try {
    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["customer", "invoice.subscription"],
    })
    console.log("Payment Intent:", JSON.stringify(paymentIntent, null, 2))
    // Get the subscription ID from the payment intent
    let subscriptionId = null
    let customerId = null
    let email = null

    // Get customer ID and email
    if (paymentIntent.customer) {
      customerId = typeof paymentIntent.customer === "string" ? paymentIntent.customer : paymentIntent.customer.id

      // If we have expanded customer object, get the email
      if (typeof paymentIntent.customer !== "string" && !paymentIntent.customer.deleted) {
        email = paymentIntent.customer.email
      }
    }

    // Get subscription ID from invoice
    if (paymentIntent.invoice && typeof paymentIntent.invoice !== "string") {
      if (paymentIntent.invoice.subscription) {
        subscriptionId =
          typeof paymentIntent.invoice.subscription === "string"
            ? paymentIntent.invoice.subscription
            : paymentIntent.invoice.subscription.id
      }
    }

    // If we couldn't get the subscription ID from the invoice,
    // try to find it by querying subscriptions for this customer
    if (!subscriptionId && customerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: "active",
      })

      if (subscriptions.data.length > 0) {
        subscriptionId = subscriptions.data[0].id
      }
    }

    // If we still don't have the customer's email, try to get it
    if (!email && customerId) {
      const customer = await stripe.customers.retrieve(customerId)
      if (typeof customer !== "string" && !customer.deleted) {
        email = customer.email
      }
    }

    return NextResponse.json({
      subscriptionId,
      customerId,
      email,
    })
  } catch (error: any) {
    console.error("Error retrieving subscription from payment:", error)
    return NextResponse.json({ error: error.message || "Failed to retrieve subscription details" }, { status: 500 })
  }
}

