import Link from "next/link"
import { ArrowRight, BarChart3, CreditCard, Globe, Package, Settings, ShoppingBag, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">JES-Storefront</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create your online store in minutes
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    JES-Storefront lets you build and share your own online store instantly. Add products, customize your
                    storefront, and start selling today - no technical skills required.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5">
                      Create Your Store
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button size="lg" variant="outline">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src="/supermarket.webp"
                width={550}
                height={550}
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto  px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Create, customize, and share your store in three simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold">Sign Up</h3>
                <p className="mt-2 text-muted-foreground">
                  Create your account in seconds and get access to all JES-Storefront features
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold">Create Your Store</h3>
                <p className="mt-2 text-muted-foreground">
                  Add products, customize your store&apos;s appearance, and set your prices
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-xl font-bold">Share & Sell</h3>
                <p className="mt-2 text-muted-foreground">
                  Share your unique store link with customers and start receiving orders
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to run your business and accept payments online
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Globe className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Multiple Storefronts</CardTitle>
                  <CardDescription>Create and manage multiple stores from a single dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Each store gets its own unique URL that you can share with customers. Perfect for managing different
                    brands or product lines.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Package className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Track stock levels and get low inventory alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Automatically track product inventory, receive notifications when stock is low, and prevent
                    overselling with real-time updates.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CreditCard className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Secure Payments</CardTitle>
                  <CardDescription>Accept payments via JES-Storefront with a simple two-step approval process</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Customers can pay directly with their JES-Storefront accounts. All transactions are secure and encrypted.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Analytics & Insights</CardTitle>
                  <CardDescription>Track sales, customer behavior, and store performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Get detailed reports on your sales, popular products, and customer demographics to optimize your
                    business.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Settings className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Customization</CardTitle>
                  <CardDescription>Brand your storefront with your logo, colors, and messaging</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Create a unique shopping experience that reflects your brand identity and resonates with your
                    customers.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Customer Management</CardTitle>
                  <CardDescription>Build relationships with your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Track customer orders, manage communications, and build a loyal customer base with integrated tools.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="sharing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Share Your Store Anywhere</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Your JES-Storefront store comes with a unique, shareable link that works everywhere. Share it on social
                    media, in emails, or via messaging apps to reach your customers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" variant="outline" className="gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    Facebook
                  </Button>
                  <Button size="lg" variant="outline" className="gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    Twitter
                  </Button>
                  <Button size="lg" variant="outline" className="gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                    Instagram
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md overflow-hidden rounded-lg border bg-background p-2 shadow-xl">
                  <div className="flex items-center border-b p-2">
                    <div className="flex space-x-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto flex items-center justify-center rounded-md bg-muted px-4 py-1 text-sm">
                      yourstore.JES-Storefront.com
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary"></div>
                        <div className="font-medium">Your Store Name</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Cart (3)
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="rounded-md border p-2">
                        <div className="h-20 rounded bg-muted"></div>
                        <div className="mt-2 h-4 w-3/4 rounded bg-muted"></div>
                        <div className="mt-1 h-3 w-1/2 rounded bg-muted"></div>
                      </div>
                      <div className="rounded-md border p-2">
                        <div className="h-20 rounded bg-muted"></div>
                        <div className="mt-2 h-4 w-3/4 rounded bg-muted"></div>
                        <div className="mt-1 h-3 w-1/2 rounded bg-muted"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of businesses already using JES-Storefront to grow their revenue
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-1.5">
                    Create Your Store
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2025 JES-Storefront. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
