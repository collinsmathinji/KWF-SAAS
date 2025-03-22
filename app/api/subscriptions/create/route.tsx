// File: /app/api/subscriptions/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

export async function POST(request: NextRequest) {
  try {
    const subscriptionData = await request.json();

    // Validate required fields
    if (!subscriptionData.user_id || !subscriptionData.email) {
      return NextResponse.json(
        { message: 'User ID and email are required' },
        { status: 400 }
      );
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Insert subscription record
    const { data, error } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: subscriptionData.user_id,
        subscription_id: subscriptionData.subscription_id || null,
        customer_id: subscriptionData.customer_id || '',
        email: subscriptionData.email,
        status: subscriptionData.status || 'active',
        created_at: subscriptionData.created_at || new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error creating subscription record:', error);
      
      // Check if it's a duplicate subscription error
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { message: 'Subscription record already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { message: error.message || 'Failed to create subscription record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      subscription: data?.[0] || null,
      message: 'Subscription record created successfully'
    });

  } catch (error: any) {
    console.error('Unexpected error in subscription creation:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}