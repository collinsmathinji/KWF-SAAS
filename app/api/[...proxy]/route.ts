import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const EXTERNAL_API_BASE = "http://localhost:5000/admin"

export async function GET(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

export async function POST(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

export async function PUT(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

export async function DELETE(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

async function handleRequest(request: NextRequest, pathSegments: string[]) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("auth-token")?.value

    // Join the path segments with a slash
    const apiPath = pathSegments.join("/")

    console.log(`Processing request for path: ${apiPath}, token exists: ${!!token}`)

    // Endpoints that don't require authentication
    const publicEndpoints = ["auth/register", "completeSignUp", "auth/login", "auth/completeSignUp"]
    if (!token && !publicEndpoints.some((endpoint) => apiPath.includes(endpoint))) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const method = request.method
    console.log(`Proxying ${method} request to: ${EXTERNAL_API_BASE}/${apiPath}`)
    let body = null
    if (method !== "GET" && method !== "HEAD") {
      body = await request.json().catch(() => null)
    }
console.log('Request body:', body)
    console.log('Request headers:', request.headers.get('Content-Type'))
    console.log('Request method:', request.method)
    const response = await fetch(`${EXTERNAL_API_BASE}/${apiPath}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      console.log("Response data:", data)
      return NextResponse.json(data, { status: response.status })
    } else {
      // Handle non-JSON responses
      const text = await response.text()
      console.error("Non-JSON response:", text.substring(0, 200) + "...")
      return NextResponse.json(
        {
          message: "Invalid response from external API",
          status: response.status,
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("API proxy error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
