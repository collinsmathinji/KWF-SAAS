import { PLANS } from "../stripe/config";
import Stripe from "stripe";
import { NextResponse } from "next/server";
if (!process.env.NEXT_STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}else{
  console.log("✅ STRIPE_SECRET_KEY is present")
}
const stripeClient = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
})
export async function POST(req: Request) {
  try {
    console.log("⏳ Receiving subscription request...");
    
    const { planId } = await req.json();
    console.log("✅ Received Plan ID:", planId);

    const plan = PLANS[planId as keyof typeof PLANS];

    if (!plan || !plan.price) {
      console.error("❌ Invalid Plan Selected:", planId);
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    // Ensure Stripe is initialized
    if (!stripeClient) {
      console.error("❌ Stripe is not initialized!");
      return NextResponse.json({ error: "Stripe is not initialized" }, { status: 500 });
    }

    console.log("✅ Creating subscription for Plan:", plan.price);

    const subscription = await stripeClient.subscriptions.create({
      customer: 'cus_Rk6fIFMEbBioEo', // Replace with an actual customer ID
      payment_behavior: "default_incomplete",
      items: [{ price: plan.price.toString() }],
      expand: ["latest_invoice.payment_intent"],
    });

    console.log("✅ Subscription created successfully:", subscription.id);

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;

    console.log("✅ Payment Intent retrieved:", payment_intent.client_secret);

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: payment_intent.client_secret,
    });
  } catch (error) {
    console.error("🚨 Error creating subscription:", error);
    return NextResponse.json({ error: "Error creating subscription" }, { status: 500 });
  }
}
