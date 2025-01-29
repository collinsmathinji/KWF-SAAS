import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white" />
      <div className="relative">
        <div className="container flex flex-col items-center gap-4 px-4 py-24 text-center md:py-32">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Manage your organization
            <br />
            with ease
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl">
            The all-in-one platform for managing member types, groups, and events. Streamline your organization&apos;s
            operations today.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/pricing">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
           
          </div>
          <div className="mt-8">
            <div className="rounded-xl border bg-white/50 p-1 backdrop-blur-xl">
              <img
                src="/placeholder.svg?height=600&width=1200"
                alt="Dashboard Preview"
                className="rounded-lg border shadow-2xl"
                width={1200}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

