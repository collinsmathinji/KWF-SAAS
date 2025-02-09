import Stripe from "stripe"

// Development configuration
const isDevelopment = process.env.NODE_ENV !== "production"

// Initialize Stripe only on the server side
const stripe =
  typeof window === "undefined" && !isDevelopment
    ? new Stripe(process.env.NEXT_STRIPE_SECRET_KEY || "", { apiVersion: "2025-01-27.acacia" })
    : null

// Client-safe plan configuration
export const PLANS = {
  starter: {
    name: "Starter",
    id: "starter",
    price:'price_1QqbS2QKV3Rv0sYpn9KArWpu',
  },
  professional: {
    name: "Professional",
    id: "professional",
    price:'price_1QqbSeQKV3Rv0sYpvt3GwIpe',
  },
  enterprise: {
    name: "Enterprise",
    id: "enterprise",
    price: 'price_1QqbTAQKV3Rv0sYpA6ylIOwJ',
  },
}

export { stripe }

