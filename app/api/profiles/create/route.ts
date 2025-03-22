// File: /app/api/profiles/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();

    // Validate required fields
    if (!profileData.id || !profileData.email) {
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

    // Insert profile record
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name || null,
        is_admin: profileData.is_admin || false,
        created_at: profileData.created_at || new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error creating profile:', error);
      
      // Check if it's a duplicate profile error
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { message: 'Profile already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { message: error.message || 'Failed to create profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      profile: data?.[0] || null,
      message: 'Profile created successfully'
    });

  } catch (error: any) {
    console.error('Unexpected error in profile creation:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}