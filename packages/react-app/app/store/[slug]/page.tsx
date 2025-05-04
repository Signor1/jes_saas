"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingBag, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/components/notifications"
import { MotionDiv, MotionLi, MotionUl, fadeIn, itemFade, staggerContainer } from "@/components/animations/motion"
import Image from "next/image"

interface Store {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  isActive: boolean
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
}

export default function StorePage() {
  const params = useParams()
  const { slug } = params
  const { addNotification } = useNotifications()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const addToCart = (product: Product) => {
    // Check if product is in stock
    if (product.stock <= 0) {
      return
    }

    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      // Check if adding one more would exceed available stock
      if (existingItem.quantity >= product.stock) {
        return
      }

      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    // Get the product to check stock
    const product = products.find((p) => p.id === productId)
    if (product && newQuantity > product.stock) {
      return // Don't allow quantity to exceed stock
    }

    setCartItems(cartItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {

    // Create notifications for the store owner
    cartItems.forEach((item) => {
      const updatedProducts = products.map((product) =>
        product.id === item.id ? { ...product, stock: product.stock - item.quantity } : product,
      )
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      // Send notification
      addNotification({
        title: "New Order Received",
        message: `You have received a new order for ${item.name} (${item.quantity} items).`,
        type: "order",
      })

      // Check if stock is low after purchase
      const updatedProduct = updatedProducts.find((p) => p.id === item.id)
      if (updatedProduct && updatedProduct.stock <= 5 && updatedProduct.stock > 0) {
        addNotification({
          title: "Low Stock Alert",
          message: `${updatedProduct.name} is running low on stock (${updatedProduct.stock} remaining).`,
          type: "stock",
        })
      }

      if (updatedProduct && updatedProduct.stock === 0) {
        addNotification({
          title: "Out of Stock Alert",
          message: `${updatedProduct.name} is now out of stock.`,
          type: "stock",
        })
      }
    })

    // Clear cart
    setCartItems([])

    // Show success message
    alert("Order placed successfully! The store owner has been notified.")
  }

  if (isLoading || !store) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <MotionDiv variants={fadeIn} initial="hidden" animate="visible" className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={store.logo || "/leather.jpeg?height=40&width=40"}
              alt={store.name}
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="text-xl font-bold">{store.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              )}
            </div>
            <Input type="search" placeholder="Search products..." className="hidden md:block w-[200px] lg:w-[300px]" />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <MotionDiv variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
            <p className="text-muted-foreground">{store.description}</p>
          </MotionDiv>

          <Tabs defaultValue="products" className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="products" className="space-y-4">
              <MotionUl
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {products.map((product) => (
                  <MotionLi key={product.id} variants={itemFade}>
                    <Card className="overflow-hidden h-full flex flex-col">
                      <Image
                        src={product.image || "/leather.jpeg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="h-[200px] w-full object-cover"
                      />
                      <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                          {product.stock <= 0 ? (
                            <Badge variant="destructive">Out of stock</Badge>
                          ) : product.stock <= 5 ? (
                            <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                              Low stock: {product.stock}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                              In stock
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </MotionLi>
                ))}
              </MotionUl>
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
                        <MotionUl variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                          {cartItems.map((item) => (
                            <MotionLi key={item.id} variants={itemFade}>
                              <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-4">
                                  <Image
                                    src={item.image || "/leather.jpeg"}
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
                            </MotionLi>
                          ))}
                        </MotionUl>
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
                        <Button className="w-full" onClick={handleCheckout}>
                          Checkout with MiniPay
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
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src={store.logo || "/leather.jpeg?height=20&width=20"}
              alt={store.name}
              className="h-5 w-5 object-contain"
            />
            <p className="text-sm text-muted-foreground">© 2025 {store.name}. All rights reserved.</p>
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
    </MotionDiv>
  )
}
