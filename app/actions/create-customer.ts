"use server"

import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!)

export async function createCustomer(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string

    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    })

    return {
      success: true,
      customerId: customer.id,
      message: "Customer created successfully",
    }
  } catch (error) {
    console.error("Error creating customer:", error)
    return {
      success: false,
      message: "Failed to create customer",
    }
  }
}

