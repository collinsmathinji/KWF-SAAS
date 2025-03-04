export async function getOrgDetails(orgId: string) {
  // Simulate database lookup
  return {
    id: orgId,
    name: "Example Organization",
    description:
      "We're dedicated to making a positive impact in our community through various initiatives and programs.",
    stripeAccountId: process.env.STRIPE_ACCOUNT_ID,
  }
}

