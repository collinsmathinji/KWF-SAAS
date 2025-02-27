import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST() {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable")
    } else {
      console.log("✅ STRIPE_SECRET_KEY is present:", stripeSecretKey)
    }
    
    // Initialize Stripe with the latest API version
    const stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia", // Updated to latest stable version
      typescript: true,
    })
    // Create a new Express connected account
    const account = await stripeClient.accounts.create({
      type: "express",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      // You can pre-fill some information if you have it
      // email: user.email,
      // business_profile: {
      //   name: user.organization,
      //   url: user.website,
      // },
    })

    // Store the account ID in your database
    // This is where you would associate the account with your user
    // await db.user.update({ where: { id: userId }, data: { stripeAccountId: account.id } })

    // Create an account link for onboarding
    const accountLink = await stripeClient.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connect?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/connect?success=true`,
      type: "account_onboarding",
    })

    return NextResponse.json({
      success: true,
      accountId: account.id,
      accountLinkUrl: accountLink.url,
    })
  } catch (error) {
    console.error("Error creating Stripe account:", error)
    return NextResponse.json({ error: "Failed to create Stripe account" }, { status: 500 })
  }
}

