import Stripe from "stripe"

const stripe =
  typeof window === "undefined"
    ? new Stripe(process.env.NEXT_STRIPE_SECRET_KEY|| "", {
        apiVersion: "2025-01-27.acacia", 
        typescript: true,
      })
    : null


export const PLANS = {
  starter: {
    name: "Starter",
    id: "starter",
    description: "For small organizations starting their journey",
    basePrice: 19.99,
    priceId: "price_starter", 
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
    priceId: "price_basic", // Replace with your actual Stripe price ID
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
    priceId: "price_pro", // Replace with your actual Stripe price ID
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
    priceId: "price_business", // Replace with your actual Stripe price ID
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
    priceId: "price_enterprise", // Replace with your actual Stripe price ID
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
    priceId: "price_scale", // Replace with your actual Stripe price ID
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
    priceId: "price_ultra", // Replace with your actual Stripe price ID
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

// Type for the plans
export type PlanId = keyof typeof PLANS
export type Plan = (typeof PLANS)[PlanId]

// Helper function to get plan by ID with type safety
export function getPlan(planId: PlanId): Plan {
  return PLANS[planId]
}

// Helper function to check if Stripe is initialized
export function getStripe() {
  if (!stripe) {
    throw new Error("Stripe is not initialized. This method should only be called on the server side.")
  }
  return stripe
}

export { stripe }

