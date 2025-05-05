"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"


const getStoreSettings = () => {

  return {
    storeName: "JES Store",
    storeDescription: "Welcome to our store. Find great products at amazing prices!",
    logo: "/leatherBag.jpeg",
    primaryColor: "#7c3aed",
    secondaryColor: "#c4b5fd",
    accentColor: "#f97316",
    fontFamily: "Inter",
    footerText: "© 2025 JES-Storefront Store. All rights reserved.",
    showFeaturedProducts: true,
    showTestimonials: true,
    enableDarkMode: true,
  }
}

export default function StorePage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [storeSettings, setStoreSettings] = useState(getStoreSettings())

  // Load settings from localStorage on component mount
  useEffect(() => {
    const settings = getStoreSettings()
    setStoreSettings(settings)

    // Apply theme settings
    if (settings.primaryColor) {
      document.documentElement.style.setProperty("--primary", settings.primaryColor)
    }
    if (settings.secondaryColor) {
      document.documentElement.style.setProperty("--secondary", settings.secondaryColor)
    }
    if (settings.accentColor) {
      document.documentElement.style.setProperty("--accent", settings.accentColor)
    }

    // Apply font family if specified
    if (settings.fontFamily) {
      document.body.style.fontFamily = settings.fontFamily
    }
  }, [])

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Premium T-Shirt",
      description: "High-quality cotton t-shirt with custom design",
      price: 29.99,
      image: "/leatherBag.jpeg",
    },
    {
      id: 2,
      name: "Wireless Earbuds",
      description: "Bluetooth earbuds with noise cancellation",
      price: 49.99,
      image: "/leatherBag.jpeg",
    },
    {
      id: 3,
      name: "LeatherBag Wallet",
      description: "Genuine leatherBag wallet with multiple card slots",
      price: 39.99,
      image: "/leatherBag.jpeg",
    },
    {
      id: 4,
      name: "Fitness Tracker",
      description: "Water-resistant fitness tracker with heart rate monitor",
      price: 79.99,
      image: "/leatherBag.jpeg",
    },
    {
      id: 5,
      name: "Phone Case",
      description: "Durable phone case with drop protection",
      price: 19.99,
      image: "/leatherBag.jpeg",
    },
    {
      id: 6,
      name: "Smart Watch",
      description: "Feature-rich smartwatch with health tracking",
      price: 129.99,
      image: "/leatherBag.jpeg",
    },
  ]

  const categories = ["All", "Clothing", "Electronics", "Accessories", "Fitness"]

  const addToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Apply custom styles based on store settings
  const customStyles = {
    primaryButton: {
      backgroundColor: storeSettings.primaryColor,
      color: "#fff",
      border: "none",
    },
    accentBadge: {
      backgroundColor: storeSettings.accentColor,
      color: "#fff",
    },
    secondaryBackground: {
      backgroundColor: storeSettings.secondaryColor,
      color: "#000",
    },
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ fontFamily: storeSettings.fontFamily }}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={storeSettings.logo || "/leatherBag.jpeg?height=40&width=40"}
              alt="Store logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold">{storeSettings.storeName}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                  style={customStyles.accentBadge}
                >
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              )}
            </div>
            <Input type="search" placeholder="Search products..." className="hidden md:block w-[200px] lg:w-[300px]" />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-8">
          {storeSettings.showFeaturedProducts && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Featured Products</h2>
              <div className="p-6 rounded-lg mb-8" style={customStyles.secondaryBackground}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.slice(0, 3).map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <Image
                        src={product.image || "/leatherBag.jpeg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="h-[200px] w-full object-cover"
                      />
                      <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <p className="mt-2 text-lg font-bold">${product.price.toFixed(2)}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => addToCart(product)}
                          style={customStyles.primaryButton}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="products" className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="products">All Products</TabsTrigger>
                <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
            <TabsContent value="products" className="space-y-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <Image
                      src={product.image || "/leatherBag.jpeg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="h-[200px] w-full object-cover"
                    />
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <p className="mt-2 text-lg font-bold">${product.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => addToCart(product)} style={customStyles.primaryButton}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="cart" className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add some products to your cart to continue shopping
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Shopping Cart</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-4">
                              <div className="flex items-center gap-4">
                                <Image
                                  src={item.image || "/leatherBag.jpeg"}
                                  alt={item.name}
                                  width={60}
                                  height={60}
                                  className="h-[60px] w-[60px] rounded-md object-cover"
                                />
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => (window.location.href = "/checkout")}
                          style={customStyles.primaryButton}
                        >
                          Checkout with JES-Storefront
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src={storeSettings.logo || "/leatherBag.jpeg?height=20&width=20"}
              alt="Store logo"
              className="h-5 w-5 object-contain"
            />
            <p className="text-sm text-muted-foreground">{storeSettings.footerText}</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
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
