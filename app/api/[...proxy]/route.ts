// app/api/[...proxy]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Fix for the "Route used params.proxy" error
export async function GET(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  const pathSegments = params.proxy;
  return handleRequest(request, pathSegments);
}

export async function POST(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  const pathSegments = params.proxy;
  return handleRequest(request, pathSegments);
}

export async function PUT(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  const pathSegments = params.proxy;
  return handleRequest(request, pathSegments);
}

export async function DELETE(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  const pathSegments = params.proxy;
  return handleRequest(request, pathSegments);
}

// Common handler for all HTTP methods
async function handleRequest(request: NextRequest, pathSegments: string[]) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Extract the request method
    const method = request.method;
    
    // Combine path segments to form the API path
    const path = pathSegments.join('/');
    console.log(`Processing request for path: ${path}, token exists: ${!!session?.accessToken}`);
    
    // Get the request body if it exists
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await request.json().catch(() => null);
      } else if (contentType?.includes('multipart/form-data')) {
        // Handle form data if needed
        body = await request.formData().catch(() => null);
      } else {
        body = await request.text().catch(() => null);
      }
    }
    
    // Create headers for the backend request
    const headers: HeadersInit = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    };
    
    // Add the authorization token if it exists
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
    
    // Construct the URL for the backend API
    const backendUrl = `http://localhost:5000/admin/${path}`;
    console.log(`Proxying ${method} request to: ${backendUrl}`);
    console.log(`Request body: ${JSON.stringify(body)}`);
    console.log(`Request headers: ${headers['Content-Type']}`);
    console.log(`Request method: ${method}`);
    
    // Make the request to the backend API
    const response = await fetch(backendUrl, {
      method: method,
      headers: headers,
      body: method !== 'GET' && method !== 'HEAD' && body ? 
        (body instanceof FormData ? body : JSON.stringify(body)) : 
        undefined,
    });
    
    // Get the response data
    const data = await response.json().catch(() => null);
    console.log(`Response data: ${JSON.stringify(data, null, 2)}`);
    
    // Return the response from the backend API
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in proxy handler:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}