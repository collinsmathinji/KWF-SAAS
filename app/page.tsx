import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronRight, Laptop, Users, Calendar, Zap } from "lucide-react"
import Image from "next/image"
import { Pricing } from "@/components/pricing"
import UPF from "@/public/download.png"
import Work from "@/public/online.jpg"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between max-w-7xl 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600 2xl:h-8 2xl:w-8" />
            <span className="text-xl font-bold 2xl:text-2xl">KWF_SAAS</span>
          </div>
          <nav className="hidden md:flex gap-6 2xl:gap-12">
            {["Features", "Pricing", "Testimonials", "Contact"].map((item) => (
              <Link
                key={item}
                className="text-sm font-medium hover:text-blue-600 transition-colors 2xl:text-lg"
                href={`#${item.toLowerCase()}`}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 2xl:gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors 2xl:text-lg">
              Sign In
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700 2xl:text-lg 2xl:px-3 2xl:py-3">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4 2xl:h-5 2xl:w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50 to-white lg:pt-32 lg:pb-24 2xl:pt-40 2xl:pb-32">
          <div className="container max-w-7xl 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 2xl:gap-20">
              <div className="flex-1 space-y-6 2xl:space-y-8">
                <h1 className="text-4xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold leading-tight tracking-tighter">
                  Organize your team's work in one place
                </h1>
                <p className="text-xl 2xl:text-2xl text-slate-600 md:max-w-[85%]">
                  The all-in-one workspace for your notes, tasks, and team collaboration. Boost productivity like never
                  before.
                </p>
                <div className="flex gap-4 2xl:gap-6">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 2xl:text-xl 2xl:px-8 2xl:py-7">
                    Start for free
                  </Button>
                  <Button size="lg" variant="outline" className="2xl:text-xl 2xl:px-8 2xl:py-7">
                    Watch demo
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={Work || "/placeholder.svg"}
                    fill
                    alt="Dashboard Preview"
                    className="rounded-lg shadow-2xl object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 lg:py-32 2xl:py-40" id="features">
          <div className="container max-w-7xl 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mx-auto px-4">
            <div className="text-center mb-16 2xl:mb-24">
              <h2 className="text-3xl md:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold mb-4 2xl:mb-6">
                Everything you need to manage your organization
              </h2>
              <p className="text-xl 2xl:text-2xl text-slate-600 md:max-w-[70%] mx-auto">
                Powerful features to help your team stay organized, focused, and productive
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 2xl:gap-16">
              {[
                {
                  icon: <Laptop className="h-10 w-10 2xl:h-12 2xl:w-12 text-blue-600 mb-2" />,
                  title: "Smart Workspace",
                  description: "Customizable workspace that adapts to your team's needs",
                  features: ["Flexible layouts", "Custom templates", "Rich text editing"],
                },
                {
                  icon: <Users className="h-10 w-10 2xl:h-12 2xl:w-12 text-blue-600 mb-2" />,
                  title: "Team Collaboration",
                  description: "Work together seamlessly with your team",
                  features: ["Real-time editing", "Comments & mentions", "File sharing"],
                },
                {
                  icon: <Calendar className="h-10 w-10 2xl:h-12 2xl:w-12 text-blue-600 mb-2" />,
                  title: "Project Management",
                  description: "Keep track of projects and deadlines",
                  features: ["Task tracking", "Timeline views", "Progress reports"],
                },
              ].map((feature, index) => (
                <Card key={index} className="2xl:p-8">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="2xl:text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="2xl:text-lg">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 2xl:space-y-4">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-5 w-5 2xl:h-6 2xl:w-6 text-green-500" />
                          <span className="2xl:text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 lg:py-32 2xl:py-40 bg-blue-50">
          <div className="container max-w-7xl 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mx-auto px-4">
            <div className="text-center mb-16 2xl:mb-24">
              <h2 className="text-3xl 2xl:text-5xl font-bold mb-4">Trusted by leading companies</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 2xl:gap-16 items-center justify-items-center opacity-80">
              <Card className="py-8 px-8 2xl:py-12 2xl:px-12 flex flex-col items-center justify-center">
                <Image
                  src={UPF || "/placeholder.svg"}
                  width={300}
                  height={200}
                  alt="UPF logo"
                  className="h-12 w-auto 2xl:h-16"
                />
                <CardDescription className="mt-8 2xl:text-lg">
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
                  className="h-12 w-auto 2xl:h-16"
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 2xl:py-40">
          <div className="container max-w-7xl 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mx-auto px-4">
            <div className="bg-blue-300 text-white rounded-2xl p-12 2xl:p-20 text-center">
              <h2 className="text-3xl md:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold mb-4 2xl:mb-6">
                Ready to transform your organization?
              </h2>
              <p className="text-xl 2xl:text-2xl mb-8 2xl:mb-12 text-blue-100">
                Join thousands of teams already using OrgFlow to improve their productivity.
              </p>
              <Pricing />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 2xl:py-20">
        <div className="container max-w-7xl 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 2xl:gap-16">
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Blog"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "Guides"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Cookie Policy"],
              },
            ].map((section, index) => (
              <div key={index} className="space-y-4 2xl:space-y-6">
                <h3 className="font-bold 2xl:text-xl">{section.title}</h3>
                <ul className="space-y-2 2xl:space-y-4">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="text-sm 2xl:text-base text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm 2xl:text-base text-slate-600">
            <p>&copy; {new Date().getFullYear()} OrgFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

