import Stripe from "stripe"
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.log("stripesecret", stripeSecretKey)
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY")
} else {
  console.log("✅ STRIPE_SECRET_KEY is present:", stripeSecretKey)
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
})
