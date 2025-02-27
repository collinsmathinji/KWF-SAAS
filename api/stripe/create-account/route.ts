import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST() {
  try {
    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    // Create a new Express connected account
    const account = await stripe.accounts.create({
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
    const accountLink = await stripe.accountLinks.create({
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

