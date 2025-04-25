"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  CreditCard,
  Globe,
  Home,
  ImageIcon,
  Package,
  Save,
  Settings,
  ShoppingCart,
  Smartphone,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ColorPicker } from "@/components/color-picker"
import { StorePreview } from "@/components/store-preview"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: "My MiniPay Store",
    storeDescription: "Welcome to my store. Find great products at amazing prices!",
    logo: "/placeholder.svg?height=80&width=80",
    favicon: "/placeholder.svg?height=32&width=32",
    primaryColor: "#7c3aed", // Default to purple
    secondaryColor: "#c4b5fd",
    accentColor: "#f97316",
    fontFamily: "Inter",
    footerText: "© 2023 My Store. All rights reserved.",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
    layout: "standard",
    showFeaturedProducts: true,
    showTestimonials: true,
    enableDarkMode: true,
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle color changes
  const handleColorChange = (color: string, type: "primaryColor" | "secondaryColor" | "accentColor") => {
    setStoreSettings((prev) => ({
      ...prev,
      [type]: color,
    }))
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload to a storage service
      // For demo purposes, we'll use a placeholder
      setStoreSettings((prev) => ({
        ...prev,
        logo: URL.createObjectURL(file),
      }))
    }
  }

  // Save settings
  const saveSettings = () => {
    // In a real app, this would save to a database
    toast.success("Settings saved")

    // Update theme context
    document.documentElement.style.setProperty("--primary", storeSettings.primaryColor)
    document.documentElement.style.setProperty("--secondary", storeSettings.secondaryColor)
    document.documentElement.style.setProperty("--accent", storeSettings.accentColor)

    // Navigate to store preview
    router.push("/store")
  }

  return (
    <div className="flex min-h-screen flex-col">
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
            <Link href="/dashboard" className="lg:hidden">
              <CreditCard className="h-6 w-6" />
              <span className="sr-only">Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg">Store Settings</h1>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Customization</span>
            </div>
            <Button className="ml-auto gap-1" onClick={saveSettings}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="grid gap-6 p-6 md:flex w-full">
              <div className="space-y-6 w-1/2">
                <Tabs defaultValue="branding" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="branding" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Store Identity</CardTitle>
                        <CardDescription>Customize your store's name, description, and logo.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="storeName">Store Name</Label>
                          <Input
                            id="storeName"
                            name="storeName"
                            value={storeSettings.storeName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storeDescription">Store Description</Label>
                          <Textarea
                            id="storeDescription"
                            name="storeDescription"
                            value={storeSettings.storeDescription}
                            onChange={handleChange}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo">Store Logo</Label>
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-md border overflow-hidden flex items-center justify-center bg-white">
                              <img
                                src={storeSettings.logo || "/placeholder.svg"}
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
                        <div className="space-y-2">
                          <Label htmlFor="footerText">Footer Text</Label>
                          <Input
                            id="footerText"
                            name="footerText"
                            value={storeSettings.footerText}
                            onChange={handleChange}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Typography</CardTitle>
                        <CardDescription>Choose fonts and text styles for your store.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fontFamily">Font Family</Label>
                          <select
                            id="fontFamily"
                            name="fontFamily"
                            value={storeSettings.fontFamily}
                            onChange={(e) => handleChange(e as any)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          >
                            <option value="Inter">Inter (Default)</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Open Sans">Open Sans</option>
                          </select>
                        </div>
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Text Preview</h4>
                          <div className="p-3 rounded-md border" style={{ fontFamily: storeSettings.fontFamily }}>
                            <p className="text-2xl font-bold mb-2">Heading Text</p>
                            <p className="text-base mb-2">This is how your body text will appear on your store.</p>
                            <p className="text-sm text-muted-foreground">
                              This is smaller text for descriptions and details.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Color Scheme</CardTitle>
                        <CardDescription>Customize your store's colors to match your brand.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>Primary Color</Label>
                          <div className="flex items-center gap-4">
                            <div
                              className="h-10 w-10 rounded-md border"
                              style={{ backgroundColor: storeSettings.primaryColor }}
                            />
                            <div className="flex-1">
                              <ColorPicker
                                color={storeSettings.primaryColor}
                                onChange={(color) => handleColorChange(color, "primaryColor")}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Used for buttons, links, and primary actions.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Secondary Color</Label>
                          <div className="flex items-center gap-4">
                            <div
                              className="h-10 w-10 rounded-md border"
                              style={{ backgroundColor: storeSettings.secondaryColor }}
                            />
                            <div className="flex-1">
                              <ColorPicker
                                color={storeSettings.secondaryColor}
                                onChange={(color) => handleColorChange(color, "secondaryColor")}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Used for backgrounds, cards, and secondary elements.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Accent Color</Label>
                          <div className="flex items-center gap-4">
                            <div
                              className="h-10 w-10 rounded-md border"
                              style={{ backgroundColor: storeSettings.accentColor }}
                            />
                            <div className="flex-1">
                              <ColorPicker
                                color={storeSettings.accentColor}
                                onChange={(color) => handleColorChange(color, "accentColor")}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Used for highlights, badges, and special elements.
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-3">Color Preview</h4>
                          <div className="space-y-3">
                            <Button
                              style={{ backgroundColor: storeSettings.primaryColor }}
                              className="w-full border-0 hover:opacity-90"
                            >
                              Primary Button
                            </Button>
                            <div
                              className="p-3 rounded-md"
                              style={{ backgroundColor: storeSettings.secondaryColor, color: "#000" }}
                            >
                              <p className="font-medium">Secondary Background</p>
                              <p className="text-sm opacity-80">This is how your secondary elements will look.</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: storeSettings.accentColor, color: "#fff" }}
                              >
                                Accent Badge
                              </div>
                              <p className="text-sm">Accent elements like badges and highlights</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Store Layout</CardTitle>
                        <CardDescription>Customize how your store is organized and displayed.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="layout">Layout Style</Label>
                          <select
                            id="layout"
                            name="layout"
                            value={storeSettings.layout}
                            onChange={(e) => handleChange(e as any)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          >
                            <option value="standard">Standard (Default)</option>
                            <option value="modern">Modern</option>
                            <option value="minimal">Minimal</option>
                            <option value="classic">Classic</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <h4 className="text-sm font-medium">Featured Products Section</h4>
                            <p className="text-xs text-muted-foreground">Show featured products on your homepage</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={storeSettings.showFeaturedProducts}
                                onChange={() =>
                                  setStoreSettings((prev) => ({
                                    ...prev,
                                    showFeaturedProducts: !prev.showFeaturedProducts,
                                  }))
                                }
                              />
                              <div
                                className={cn(
                                  "w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300",
                                  "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
                                  "after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5",
                                  "after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full",
                                )}
                              ></div>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <h4 className="text-sm font-medium">Testimonials Section</h4>
                            <p className="text-xs text-muted-foreground">Show customer testimonials on your homepage</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={storeSettings.showTestimonials}
                                onChange={() =>
                                  setStoreSettings((prev) => ({
                                    ...prev,
                                    showTestimonials: !prev.showTestimonials,
                                  }))
                                }
                              />
                              <div
                                className={cn(
                                  "w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300",
                                  "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
                                  "after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5",
                                  "after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full",
                                )}
                              ></div>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <h4 className="text-sm font-medium">Dark Mode Support</h4>
                            <p className="text-xs text-muted-foreground">Allow customers to switch to dark mode</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={storeSettings.enableDarkMode}
                                onChange={() =>
                                  setStoreSettings((prev) => ({
                                    ...prev,
                                    enableDarkMode: !prev.enableDarkMode,
                                  }))
                                }
                              />
                              <div
                                className={cn(
                                  "w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300",
                                  "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
                                  "after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5",
                                  "after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full",
                                )}
                              ></div>
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Social Media</CardTitle>
                        <CardDescription>Connect your store to your social media accounts.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="facebook">Facebook URL</Label>
                          <Input
                            id="facebook"
                            name="socialLinks.facebook"
                            value={storeSettings.socialLinks.facebook}
                            onChange={(e) =>
                              setStoreSettings((prev) => ({
                                ...prev,
                                socialLinks: {
                                  ...prev.socialLinks,
                                  facebook: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter URL</Label>
                          <Input
                            id="twitter"
                            name="socialLinks.twitter"
                            value={storeSettings.socialLinks.twitter}
                            onChange={(e) =>
                              setStoreSettings((prev) => ({
                                ...prev,
                                socialLinks: {
                                  ...prev.socialLinks,
                                  twitter: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram URL</Label>
                          <Input
                            id="instagram"
                            name="socialLinks.instagram"
                            value={storeSettings.socialLinks.instagram}
                            onChange={(e) =>
                              setStoreSettings((prev) => ({
                                ...prev,
                                socialLinks: {
                                  ...prev.socialLinks,
                                  instagram: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>SEO Settings</CardTitle>
                        <CardDescription>Optimize your store for search engines.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="metaTitle">Meta Title</Label>
                          <Input id="metaTitle" placeholder="Your Store Name | Products & Services" />
                          <p className="text-xs text-muted-foreground">Recommended length: 50-60 characters</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="metaDescription">Meta Description</Label>
                          <Textarea
                            id="metaDescription"
                            placeholder="A brief description of your store for search results..."
                            rows={3}
                          />
                          <p className="text-xs text-muted-foreground">Recommended length: 150-160 characters</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6 w-1/2">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Preview</CardTitle>
                    <CardDescription>See how your store will look with the current settings.</CardDescription>
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
                            <Smartphone className="h-4 w-4" />
                            Mobile
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="desktop" className="p-0">
                          <div className="border-t">
                            <StorePreview settings={storeSettings} isMobile={false} />
                          </div>
                        </TabsContent>
                        <TabsContent value="mobile" className="p-0">
                          <div className="border-t flex justify-center p-4">
                            <div className="w-[320px] border rounded-xl overflow-hidden shadow-sm">
                              <StorePreview settings={storeSettings} isMobile={true} />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href="/store">View Live Store</Link>
                    </Button>
                    <Button onClick={saveSettings} className="gap-1">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Theme Templates</CardTitle>
                    <CardDescription>Start with a pre-designed theme.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="border rounded-md p-3 cursor-pointer hover:border-primary transition-colors"
                      onClick={() =>
                        setStoreSettings((prev) => ({
                          ...prev,
                          primaryColor: "#7c3aed",
                          secondaryColor: "#c4b5fd",
                          accentColor: "#f97316",
                          fontFamily: "Inter",
                          layout: "standard",
                        }))
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Modern Purple</h4>
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-[#7c3aed]"></div>
                          <div className="h-4 w-4 rounded-full bg-[#c4b5fd]"></div>
                          <div className="h-4 w-4 rounded-full bg-[#f97316]"></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        A modern theme with purple accents and clean layout.
                      </p>
                    </div>

                    <div
                      className="border rounded-md p-3 cursor-pointer hover:border-primary transition-colors"
                      onClick={() =>
                        setStoreSettings((prev) => ({
                          ...prev,
                          primaryColor: "#0ea5e9",
                          secondaryColor: "#bae6fd",
                          accentColor: "#f43f5e",
                          fontFamily: "Poppins",
                          layout: "modern",
                        }))
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Ocean Blue</h4>
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-[#0ea5e9]"></div>
                          <div className="h-4 w-4 rounded-full bg-[#bae6fd]"></div>
                          <div className="h-4 w-4 rounded-full bg-[#f43f5e]"></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">A fresh blue theme with vibrant accents.</p>
                    </div>

                    <div
                      className="border rounded-md p-3 cursor-pointer hover:border-primary transition-colors"
                      onClick={() =>
                        setStoreSettings((prev) => ({
                          ...prev,
                          primaryColor: "#10b981",
                          secondaryColor: "#d1fae5",
                          accentColor: "#8b5cf6",
                          fontFamily: "Montserrat",
                          layout: "minimal",
                        }))
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Emerald Green</h4>
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-[#10b981]"></div>
                          <div className="h-4 w-4 rounded-full bg-[#d1fae5]"></div>
                          <div className="h-4 w-4 rounded-full bg-[#8b5cf6]"></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">A calming green theme with minimal design.</p>
                    </div>

                    <div
                      className="border rounded-md p-3 cursor-pointer hover:border-primary transition-colors"
                      onClick={() =>
                        setStoreSettings((prev) => ({
                          ...prev,
                          primaryColor: "#ef4444",
                          secondaryColor: "#fee2e2",
                          accentColor: "#3b82f6",
                          fontFamily: "Roboto",
                          layout: "classic",
                        }))
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Bold Red</h4>
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-[#ef4444]"></div>
                          <div className="h-4 w-4 rounded-full bg-[#fee2e2]"></div>
                          <div className="h-4 w-4 rounded-full bg-[#3b82f6]"></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">A bold red theme with classic layout.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
    </div>
  )
}
