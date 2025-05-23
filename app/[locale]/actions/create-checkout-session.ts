"use server"

import { PLANS } from "@/app/api/stripe/config"
import { stripe } from "@/app/api/stripe/stripehook"

export async function createCheckoutSession(planId: string, seats: number, customerId?: string) {
  try {
    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan || !plan.id) throw new Error("Invalid plan selected")

    // If we're in development, return mock data
    if (process.env.NODE_ENV !== "production") {
      return {
        sessionId: "mock_session_id",
        url: "/settings/subscription/success?session_id=mock_session_id",
      }
    }

    if (!stripe) {
      throw new Error("Stripe is not properly configured")
    }

    // Create or use existing customer
    let customer = customerId
    if (!customer) {
      const customerData = await stripe.customers.create({
        metadata: {
          seats: seats.toString(),
        },
      })
      customer = customerData.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer,
      payment_method_types: ["card", "paypal", "us_bank_account"],
      line_items: [
        {
          price: plan.id,
          quantity: seats,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          seats: seats.toString(),
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings/subscription?canceled=true`,
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

