import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import type React from "react"
import AuthProvider from "./AuthProvider";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KWF_SAAS- Organization Management Made Easy",
  description: "Streamline your organization operations with KWF_SAAS",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/_next/static/css/103f38bd7c3a1a72.css"
          as="style"
        />
        <link
          rel="preload"
          href="/_next/static/css/a979edae68e19a68.css"
          as="style"
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
      <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}