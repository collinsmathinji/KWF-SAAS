"use client"

import CampaignDetails from "../dashboard/@user/campaignDetails"
import { Zap } from "lucide-react"
import Link from "next/link"
import CampaignExplorer from "../dashboard/@user/campaignExplorer"
export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between max-w-7xl 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600 2xl:h-8 2xl:w-8" />
                <span className="text-xl font-bold 2xl:text-2xl">KWF_SAAS</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 2xl:gap-12">
            {["Features", "Pricing", "Testimonials", "Events", "Contact"].map((item) => (
              <Link
                key={item}
                className="text-sm font-medium hover:text-blue-600 transition-colors 2xl:text-lg"
                href={item === "Events" ? "/events" : `/#${item.toLowerCase()}`}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 2xl:gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors 2xl:text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Events Display */}
      <main className="flex-1">
        <CampaignExplorer/>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} KWF_SAAS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}