import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check, ChevronRight, Laptop, Users, Calendar, FileText, Zap, Shield } from 'lucide-react'
import Image from "next/image"
import { Pricing } from "@/components/pricing"
import UPF from '@/public/download.png'
import Work from '@/public/online.jpg'
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
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
          <div className="flex items-center gap-4">
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
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">
                Organize your team's work in one place
              </h1>
              <p className="text-xl text-slate-600 md:max-w-[85%]">
                The all-in-one workspace for your notes, tasks, and team collaboration. Boost productivity like never before.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start for free
                </Button>
                <Button size="lg" variant="outline">
                  Watch demo
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Image
                src={Work}
                width={670}
                height={500}
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl "
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20" id="features">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to manage your organization
              </h2>
              <p className="text-xl text-slate-600 md:max-w-[70%] mx-auto">
                Powerful features to help your team stay organized, focused, and productive
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Laptop className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Smart Workspace</CardTitle>
                  <CardDescription>
                    Customizable workspace that adapts to your team's needs
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
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>
                    Work together seamlessly with your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Real-time editing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Comments & mentions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>File sharing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>
                    Keep track of projects and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Task tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Timeline views</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Progress reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-blue-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Trusted by leading companies
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-80">
              <Card className="py-8 px-8 flex flex-col items-center justify-center">
                
            <Image
                  key={1}
                  src={UPF}
                  width={300}
                  height={200}
                  alt={`Company  logo`}
                  className="h-12 w-auto w-24 h-24 "
                />
                <CardDescription className="mt-8">
                <p className="">UNIVERSAL PEACE FEDERATION(UPF)</p>
                </CardDescription>
              </Card>
              {[1, 2, 3, ].map((i) => (
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
        <section className="py-20">
          <div className="container">
            <div className="bg-blue-300 text-white rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your organization?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of teams already using OrgFlow to improve their productivity.
              </p>
              <Pricing/>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Features</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Security</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">About</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Careers</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Documentation</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Help Center</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Guides</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Privacy</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Terms</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-blue-600">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-slate-600">
            <p>&copy; {new Date().getFullYear()} OrgFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
