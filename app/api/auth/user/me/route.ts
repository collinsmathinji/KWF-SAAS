import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    console.log('Fetching user data from:', `${apiUrl}/admin/user/me`);

    // Get the session token
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch current user data from your backend
    const response = await fetch(`${apiUrl}/admin/user/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`,
      },
    });

    console.log('Backend Response Status:', response.status);
    const data = await response.json();
    console.log('Backend Response Data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Error Response:', data);
      throw new Error('Failed to fetch user data from backend');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in user data API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 