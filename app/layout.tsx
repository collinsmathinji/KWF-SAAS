import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OrgFlow - Organization Management Made Easy",
  description: "Streamline your organization operations with OrgFlow",
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
        {children}
      </body>
    </html>
  )
}