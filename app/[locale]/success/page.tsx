"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutSuccessPage() {
  const [copied, setCopied] = useState(false)

  // Function to determine email provider based on email domain
  const getEmailProvider = (email: string) => {
    if (!email) return null

    const domain = email.split("@")[1]?.toLowerCase()

    if (!domain) return null

    const providers = [
      { name: "Gmail", domain: "gmail.com", url: "https://mail.google.com" },
      { name: "Outlook", domain: "outlook.com", url: "https://outlook.live.com" },
      { name: "Yahoo", domain: "yahoo.com", url: "https://mail.yahoo.com" },
      { name: "Proton Mail", domain: "protonmail.com", url: "https://mail.proton.me" },
      { name: "iCloud", domain: "icloud.com", url: "https://www.icloud.com/mail" },
    ]

    return providers.find((provider) => domain === provider.domain || domain.endsWith(`.${provider.domain}`))
  }


 
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your purchase. We've sent a magic link to your email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-100 p-4">
            <div className="flex items-center justify-between">
              
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Next steps:</h3>
            <ol className="list-decimal pl-5 text-sm text-gray-600">
              <li>Check your email inbox for a message from us</li>
              <li>Click on the magic link in the email to access your account</li>
              <li>If you don't see the email, check your spam folder</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">

            <div className="space-y-3 w-full">
              <p className="text-sm text-center text-gray-500">Open your email provider:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild size="sm">
                  <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                    Gmail
                  </a>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer">
                    Outlook
                  </a>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <a href="https://mail.yahoo.com" target="_blank" rel="noopener noreferrer">
                    Yahoo
                  </a>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <a href="https://www.icloud.com/mail" target="_blank" rel="noopener noreferrer">
                    iCloud
                  </a>
                </Button>
              </div>
            </div>


          <Button variant="link" asChild>
            <Link href="/">Return to homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
