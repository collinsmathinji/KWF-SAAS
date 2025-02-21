
import Stripe from "stripe"
const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
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

// Client-safe plan configuration
export const PLANS = {
  starter: {
    name: "Starter",
    id: "starter",
    description: "For small organizations starting their journey",
    basePrice: 19.99,
    priceId: "price_1QsOWpQKV3Rv0sYpuYPNnUEZ", 
    maxContacts: 50,
    maxGroups: 2,
    maxStaff: 1,
    maxEventStaff: 3,
    features: {
      memberPortal: false,
      stripePayments: true,
      prioritySupport: false,
    },
  },
  basic: {
    name: "Basic",
    id: "basic",
    description: "Perfect for growing organizations",
    basePrice: 39.99,
    priceId: "price_1QsOY1QKV3Rv0sYphgqFoZzn",
    maxContacts: 200,
    maxGroups: 5,
    maxStaff: 3,
    maxEventStaff: 10,
    features: {
      memberPortal: false,
      stripePayments: true,
      prioritySupport: false,
    },
  },
  pro: {
    name: "Pro",
    id: "pro",
    description: "Ideal for established organizations",
    basePrice: 79.99,
    priceId: "price_1QsOacQKV3Rv0sYpXL52NwBt", 
    maxContacts: 1000,
    maxGroups: 10,
    maxStaff: 10,
    maxEventStaff: 20,
    features: {
      memberPortal: "100 members",
      stripePayments: true,
      prioritySupport: false,
    },
  },
  business: {
    name: "Business",
    id: "business",
    description: "For larger organizations",
    basePrice: 149.99,
    priceId: "price_1QsObTQKV3Rv0sYp9DoF2LGd", 
    maxContacts: 5000,
    maxGroups: 20,
    maxStaff: 25,
    maxEventStaff: 50,
    features: {
      memberPortal: "500 members",
      stripePayments: true,
      prioritySupport: true,
    },
  },
  enterprise: {
    name: "Enterprise",
    id: "enterprise",
    description: "Enterprise-grade features and support",
    basePrice: 299.99,
    priceId: "price_1QsOVYQKV3Rv0sYpeSbd2edt", 
    maxContacts: 10000,
    maxGroups: 40,
    maxStaff: 50,
    maxEventStaff: 100,
    features: {
      memberPortal: "1000 members",
      stripePayments: true,
      prioritySupport: true,
    },
  },
  scale: {
    name: "Scale",
    id: "scale",
    description: "For rapidly growing organizations",
    basePrice: 499.99,
    priceId: "price_1QsOcLQKV3Rv0sYplkwnf3uI", 
    maxContacts: 20000,
    maxGroups: 80,
    maxStaff: 100,
    maxEventStaff: 200,
    features: {
      memberPortal: "2000 members",
      stripePayments: true,
      prioritySupport: true,
    },
  },
  ultra: {
    name: "Ultra",
    id: "ultra",
    description: "Maximum capabilities and support",
    basePrice: 799.99,
    priceId: "price_1QsOdRQKV3Rv0sYprlJA3IHY", 
    maxContacts: 30000,
    maxGroups: 150,
    maxStaff: 200,
    maxEventStaff: 500,
    features: {
      memberPortal: "3000 members",
      stripePayments: true,
      prioritySupport: true,
    },
  },
} as const

export type PlanId = keyof typeof PLANS
export type Plan = (typeof PLANS)[PlanId]

export function getPlan(planId: PlanId): Plan {
  return PLANS[planId]
}

