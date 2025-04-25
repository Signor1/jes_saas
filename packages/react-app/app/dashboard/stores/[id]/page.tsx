"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  Globe,
  Home,
  ImageIcon,
  Loader2,
  Package,
  Save,
  Settings,
  Share2,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ShareStore } from "@/components/share-store"
import { toast } from "sonner"

interface Store {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  isActive: boolean
  createdAt: string
}

export default function StoreDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [store, setStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  })

  useEffect(() => {
    // In a real app, this would be an API call to fetch the store
    // For demo purposes, we'll use localStorage
    const fetchStore = () => {
      const storedStores = localStorage.getItem("stores")
      if (storedStores) {
        const stores = JSON.parse(storedStores)
        const foundStore = stores.find((s: Store) => s.id === id)
        if (foundStore) {
          setStore(foundStore)
          setFormData({
            name: foundStore.name,
            description: foundStore.description,
            isActive: foundStore.isActive,
          })
        } else {
          // Store not found, redirect to stores list
          router.push("/dashboard/stores")
        }
      }
      setIsLoading(false)
    }

    fetchStore()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload to a storage service
      // For demo purposes, we'll use a placeholder
      if (store) {
        setStore({ ...store, logo: URL.createObjectURL(file) })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, this would be an API call to update the store
      // For demo purposes, we'll update localStorage
      const storedStores = localStorage.getItem("stores")
      if (storedStores && store) {
        const stores = JSON.parse(storedStores)
        const updatedStores = stores.map((s: Store) =>
          s.id === id
            ? {
                ...s,
                name: formData.name,
                description: formData.description,
                isActive: formData.isActive,
                logo: store.logo, // Use the updated logo if it was changed
              }
            : s,
        )
        localStorage.setItem("stores", JSON.stringify(updatedStores))

        // Update local state
        setStore((prev) => {
          if (!prev) return null
          return {
            ...prev,
            name: formData.name,
            description: formData.description,
            isActive: formData.isActive,
          }
        })

        toast.success("Store updated")
      }
    } catch (error) {
      toast.error("There was an error updating your store. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !store) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <CreditCard className="h-6 w-6 text-primary" />
                <span>MiniPay</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                </Link>
                <Link
                  href="/dashboard/products"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <Link
                  href="/dashboard/customers"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Users className="h-4 w-4" />
                  Customers
                </Link>
                <Link
                  href="/dashboard/stores"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                >
                  <Globe className="h-4 w-4" />
                  Stores
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
            <Button variant="ghost" size="icon" asChild className="lg:hidden">
              <Link href="/dashboard/stores">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/stores" className="hidden md:flex items-center gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Stores</span>
              </Link>
              <h1 className="font-semibold text-lg">Manage Store: {store.name}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ShareStore storeName={store.name} storeSlug={store.slug}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </ShareStore>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/store/${store.slug}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Store
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Details</CardTitle>
                      <CardDescription>Update your store information and settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Store Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="My Awesome Store"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Store Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your store..."
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logo">Store Logo</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 rounded-md border overflow-hidden flex items-center justify-center bg-white">
                            <img
                              src={store.logo || "/leather.jpe"}
                              alt="Store logo"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              id="logo"
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full mb-2"
                              onClick={() => document.getElementById("logo")?.click()}
                            >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              Upload Logo
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Recommended size: 200x200px. Max file size: 2MB.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Store Settings</CardTitle>
                      <CardDescription>Configure your store's behavior and appearance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Store Status</h4>
                          <p className="text-xs text-muted-foreground">
                            {formData.isActive
                              ? "Your store is visible to customers"
                              : "Your store is hidden from customers"}
                          </p>
                        </div>
                        <Switch checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Store URL</h4>
                          <p className="text-xs text-muted-foreground">Your store's unique web address</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            {typeof window !== "undefined"
                              ? `${window.location.origin}/store/${store.slug}`
                              : `/store/${store.slug}`}
                          </code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Preview</CardTitle>
                      <CardDescription>See how your store appears to customers</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden">
                      <div className="border-t">
                        <Tabs defaultValue="desktop" className="w-full">
                          <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="desktop" className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              Desktop
                            </TabsTrigger>
                            <TabsTrigger value="mobile" className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              Mobile
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="desktop" className="p-0">
                            <div className="border-t p-4">
                              <div className="rounded-lg border overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between border-b p-3 bg-background">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center">
                                      <img
                                        src={store.logo || "/leather.jpe"}
                                        alt="Store logo"
                                        className="max-h-full max-w-full object-contain"
                                      />
                                    </div>
                                    <span className="font-medium">{formData.name}</span>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Cart (0)
                                  </Button>
                                </div>
                                <div className="p-4 bg-muted/20">
                                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                                  <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="rounded-md border p-2 bg-background">
                                      <div className="h-20 rounded bg-muted"></div>
                                      <div className="mt-2 h-4 w-3/4 rounded bg-muted"></div>
                                      <div className="mt-1 h-3 w-1/2 rounded bg-muted"></div>
                                    </div>
                                    <div className="rounded-md border p-2 bg-background">
                                      <div className="h-20 rounded bg-muted"></div>
                                      <div className="mt-2 h-4 w-3/4 rounded bg-muted"></div>
                                      <div className="mt-1 h-3 w-1/2 rounded bg-muted"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="mobile" className="p-0">
                            <div className="border-t flex justify-center p-4">
                              <div className="w-[320px] border rounded-xl overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between border-b p-3 bg-background">
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-md bg-primary/20 flex items-center justify-center">
                                      <img
                                        src={store.logo || "/leather.jpe"}
                                        alt="Store logo"
                                        className="max-h-full max-w-full object-contain"
                                      />
                                    </div>
                                    <span className="font-medium text-sm">{formData.name}</span>
                                  </div>
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <ShoppingCart className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="p-3 bg-muted/20">
                                  <p className="text-xs text-muted-foreground">{formData.description}</p>
                                  <div className="grid grid-cols-2 gap-2 mt-3">
                                    <div className="rounded-md border p-1 bg-background">
                                      <div className="h-16 rounded bg-muted"></div>
                                      <div className="mt-1 h-3 w-3/4 rounded bg-muted"></div>
                                      <div className="mt-1 h-2 w-1/2 rounded bg-muted"></div>
                                    </div>
                                    <div className="rounded-md border p-1 bg-background">
                                      <div className="h-16 rounded bg-muted"></div>
                                      <div className="mt-1 h-3 w-3/4 rounded bg-muted"></div>
                                      <div className="mt-1 h-2 w-1/2 rounded bg-muted"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link href={`/store/${store.slug}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Live Store
                        </Link>
                      </Button>
                      <ShareStore storeName={store.name} storeSlug={store.slug}>
                        <Button variant="outline" className="gap-1">
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                      </ShareStore>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Store Statistics</CardTitle>
                      <CardDescription>Overview of your store's performance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Total Products</p>
                          <p className="text-2xl font-bold">5</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Total Orders</p>
                          <p className="text-2xl font-bold">12</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Total Revenue</p>
                          <p className="text-2xl font-bold">$1,234</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Visitors</p>
                          <p className="text-2xl font-bold">256</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isSaving} className="gap-1">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}
