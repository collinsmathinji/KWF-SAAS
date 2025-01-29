import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import PricingAndBillingPage from "../app/(marketing)/pricing/page"
import { Screenshots } from "@/components/screenshots"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <Screenshots />
        <PricingAndBillingPage />
      </main>
      <Footer />
    </div>
  )
}

