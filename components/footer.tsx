import Link from "next/link"

import { AnimatedSection } from "./ui/animated-section"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 py-12">
        <AnimatedSection>
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-semibold text-white">
                  O
                </div>
                <span className="text-xl font-semibold">OrgFlow</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Streamline your organization&apos;s operations with our all-in-one platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="#features" className="transition-colors hover:text-blue-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="transition-colors hover:text-blue-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#screenshots" className="transition-colors hover:text-blue-600">
                    Screenshots
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="#" className="transition-colors hover:text-blue-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-blue-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-blue-600">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="#" className="transition-colors hover:text-blue-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-blue-600">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-blue-600">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} OrgFlow. All rights reserved.</p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  )
}

