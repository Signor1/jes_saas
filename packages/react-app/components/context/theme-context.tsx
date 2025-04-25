"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type StoreSettings = {
  storeName: string
  storeDescription: string
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  footerText: string
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
  }
  layout: string
  showFeaturedProducts: boolean
  showTestimonials: boolean
  enableDarkMode: boolean
}

type ThemeContextType = {
  storeSettings: StoreSettings
  updateSettings: (settings: Partial<StoreSettings>) => void
}

const defaultSettings: StoreSettings = {
  storeName: "MiniPay Store",
  storeDescription: "Welcome to our store. Find great products at amazing prices!",
  logo: "/placeholder.svg?height=80&width=80",
  primaryColor: "#7c3aed",
  secondaryColor: "#c4b5fd",
  accentColor: "#f97316",
  fontFamily: "Inter",
  footerText: "© 2023 MiniPay Store. All rights reserved.",
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
  layout: "standard",
  showFeaturedProducts: true,
  showTestimonials: true,
  enableDarkMode: true,
}

const ThemeContext = createContext<ThemeContextType>({
  storeSettings: defaultSettings,
  updateSettings: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultSettings)

  // Load settings from localStorage on initial render
  useEffect(() => {
    const loadSettings = () => {
      if (typeof window === "undefined") return

      const savedSettings = localStorage.getItem("storeSettings")
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings)
          setStoreSettings(parsedSettings)

          // Apply theme settings
          applyThemeSettings(parsedSettings)
        } catch (error) {
          console.error("Failed to parse store settings:", error)
        }
      }
    }

    loadSettings()
  }, [])

  const applyThemeSettings = (settings: StoreSettings) => {
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
  }

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updatedSettings = { ...storeSettings, ...newSettings }
    setStoreSettings(updatedSettings)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("storeSettings", JSON.stringify(updatedSettings))
    }

    // Apply theme settings
    applyThemeSettings(updatedSettings)
  }

  return <ThemeContext.Provider value={{ storeSettings, updateSettings }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
