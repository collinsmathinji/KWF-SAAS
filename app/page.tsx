'use client'
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check, ChevronRight, Laptop, Users, Calendar, Zap, Menu, X } from 'lucide-react'
import Image from "next/image"
import { Pricing } from "@/components/pricing"
import UPF from '@/public/download.png'
import Work from '@/public/online.jpg'

const MobileNav = ({ isOpen, setIsOpen }:any) => {
  return (
    <div className={`
      fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">KWF_SAAS</span>
        </div>
        <button onClick={() => setIsOpen(false)}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex flex-col p-4 gap-4">
        <Link 
          className="text-lg font-medium hover:text-blue-600 p-2" 
          href="#features"
          onClick={() => setIsOpen(false)}
        >
          Features
        </Link>
        <Link 
          className="text-lg font-medium hover:text-blue-600 p-2" 
          href="#pricing"
          onClick={() => setIsOpen(false)}
        >
          Pricing
        </Link>
        <Link 
          className="text-lg font-medium hover:text-blue-600 p-2" 
          href="#testimonials"
          onClick={() => setIsOpen(false)}
        >
          Testimonials
        </Link>
        <Link 
          className="text-lg font-medium hover:text-blue-600 p-2" 
          href="#contact"
          onClick={() => setIsOpen(false)}
        >
          Contact
        </Link>
        <div className="mt-4 space-y-4">
          <Link 
            href="/login"
            className="block text-center text-lg font-medium hover:text-blue-600 p-2"
          >
            Sign In
          </Link>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Get Started
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>
    </div>
  )
}

export default function Page() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">KWF_SAAS</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium hover:text-blue-600" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-blue-600" href="#pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:text-blue-600" href="#testimonials">
              Testimonials
            </Link>
            <Link className="text-sm font-medium hover:text-blue-600" href="#contact">
              Contact
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login"
              className="text-sm font-medium hover:text-blue-600"
            >
              Sign In
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 md:pt-20 pb-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
                  Organize your teams work in one place
                </h1>
                <p className="text-lg md:text-xl text-slate-600 md:max-w-[85%]">
                  The all-in-one workspace for your notes, tasks, and team collaboration. Boost productivity like never before.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Start for free
                  </Button>
                  <Button size="lg" variant="outline">
                    Watch demo
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full">
                <Image
                  src={Work}
                  width={670}
                  height={500}
                  alt="Dashboard Preview"
                  className="rounded-lg shadow-2xl w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-20" id="features">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Everything you need to manage your organization
              </h2>
              <p className="text-lg md:text-xl text-slate-600 md:max-w-[70%] mx-auto">
                Powerful features to help your team stay organized, focused, and productive
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Feature cards remain the same */}
              <Card>
                <CardHeader>
                  <Laptop className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Smart Workspace</CardTitle>
                  <CardDescription>
                    Customizable workspace that adapts to your teams needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Flexible layouts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Custom templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Rich text editing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              {/* Repeat other feature cards... */}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 md:py-20 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Trusted by leading companies
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-80">
              <Card className="w-full py-6 px-4 flex flex-col items-center justify-center">
                <Image
                  src={UPF}
                  width={300}
                  height={200}
                  alt="UPF logo"
                  className="h-12 w-auto"
                />
                <CardDescription className="mt-4 text-center">
                  <p>UNIVERSAL PEACE FEDERATION(UPF)</p>
                </CardDescription>
              </Card>
              {[1, 2, 3].map((i) => (
                <Image
                  key={i}
                  src="/placeholder-logo.svg"
                  width={160}
                  height={80}
                  alt={`Company ${i} logo`}
                  className="h-12 w-auto"
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="bg-blue-300 text-white rounded-2xl p-6 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Ready to transform your organization?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Join thousands of teams already using OrgFlow to improve their productivity.
              </p>
              <Pricing />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Features</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Security</Link></li>
              </ul>
            </div>
            {/* Repeat other footer columns... */}
          </div>
          <div className="mt-8 md:mt-12 pt-8 border-t text-center text-sm text-slate-600">
            <p>&copy; {new Date().getFullYear()} OrgFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}