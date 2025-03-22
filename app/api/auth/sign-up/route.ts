// File: /app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

export async function POST(request: NextRequest) {
  try {
    const { email, password, metadata } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client with anon key for signup
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Create the user using standard auth API
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=/setup`,
      }
    });
    
    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to create user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      user: data.user,
      message: 'User created successfully. Please verify your email.'
    });
    
  } catch (error: any) {
    console.error('Unexpected error in signup:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}