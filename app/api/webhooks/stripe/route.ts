import { headers } from "next/headers"
import { stripe } from "../stripe/config"

export async function POST(req: Request): Promise<Response> {
  // In development, just return success
  if (process.env.NODE_ENV !== "production") {
    return new Response(null, { status: 200 })
  }

  if (!stripe) {
    return new Response("Stripe is not configured", { status: 500 })
  }

  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook signature missing", { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    switch (event.type) {
      case "checkout.session.completed":
     console.log( event.data.object)
        // Handle successful payment
        // Update user's subscription in your database
        break
      case "customer.subscription.updated":
        // Handle subscription updates
        break
      case "customer.subscription.deleted":
        // Handle subscription cancellations
        break
      default:
        console.warn(`Unhandled event type ${event.type}`)
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return new Response("Webhook error", { status: 400 })
  }
}
