import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { userId, subscriptionId, customerId, email } = await request.json()

    if (!userId || (!subscriptionId && !customerId)) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Store subscription information in your database
    const { error } = await supabase.from("user_subscriptions").insert({
      user_id: userId,
      subscription_id: subscriptionId,
      customer_id: customerId,
      email: email,
      status: "active",
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error linking subscription:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to link subscription" },
      { status: 500 },
    )
  }
}

