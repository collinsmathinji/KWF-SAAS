"use client"
import { Button } from "@/components/ui/button"
import EventsDisplay from "../dashboard/@user/eventsDisplay"
import { Zap,ChevronRight } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
           <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
             <div className="container flex h-16 max-w-screen-2xl items-center">
               <div className="flex items-center gap-2">
                 <Link href="/" className="flex items-center gap-2 group">
                   <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                     <Zap className="h-5 w-5" />
                   </div>
                   <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                     KWF_SAAS
                   </span>
                 </Link>
               </div>
     
               <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
                 <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                   Features
                 </Link>
                 <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                   Pricing
                 </Link>
                 <Link href="/events" className="text-sm font-medium text-blue-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600 after:rounded-full"
                 >
                   Events
                 </Link>
                 <Link
                   href="/donations"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                   Donations
                 </Link>
                 <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                   Contact
                 </Link>
               </nav>
     
               <div className="flex items-center justify-end gap-4">
                 <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                   Sign In
                 </Link>
                 <Button
                   className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm shadow-md hover:shadow-lg transition-all duration-300"
                   size="sm"
                 >
                   Get Started
                   <ChevronRight className="ml-2 h-4 w-4" />
                 </Button>
               </div>
             </div>
           </header>

      {/* Events Display */}
      <main className="flex-1">
        <EventsDisplay />
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