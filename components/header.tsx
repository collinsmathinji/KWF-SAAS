import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-semibold text-white">
            O
          </div>
          <span className="text-xl font-semibold">KWF_SAAS</span>
        </div>
        <nav className="hidden gap-6 md:flex">
          <Link className="text-sm font-medium hover:text-blue-600" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600" href="#screenshots">
            Screenshots
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600" href="#pricing">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/pricing">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

