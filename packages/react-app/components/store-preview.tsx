"use client"

import { CreditCard, ShoppingBag } from "lucide-react"

interface StorePreviewProps {
  settings: {
    storeName: string
    storeDescription: string
    logo: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
  }
  isMobile: boolean
}

export function StorePreview({ settings, isMobile }: StorePreviewProps) {
  const { storeName, storeDescription, logo, primaryColor, secondaryColor, accentColor, fontFamily } = settings

  return (
    <div className="overflow-hidden" style={{ fontFamily }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: secondaryColor, color: "#000" }}>
        <div className={`flex items-center justify-between ${isMobile ? "p-3" : "p-4"}`}>
          <div className="flex items-center gap-2">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-8 w-8 rounded-md" />
            <span className={`font-bold ${isMobile ? "text-sm" : "text-base"}`}>{storeName}</span>
          </div>
          <div className="flex items-center gap-3">
            {!isMobile && (
              <div className="flex gap-4">
                <span className="text-sm">Products</span>
                <span className="text-sm">Categories</span>
                <span className="text-sm">About</span>
              </div>
            )}
            <div className="relative">
              <ShoppingBag className={`${isMobile ? "h-5 w-5" : "h-5 w-5"}`} />
              <div
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor }}
              >
                2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div
        className={`${isMobile ? "px-3 py-4" : "px-6 py-8"} flex flex-col items-center text-center`}
        style={{ backgroundColor: "#fff" }}
      >
        <h1 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold mb-2`} style={{ color: primaryColor }}>
          Welcome to {storeName}
        </h1>
        <p className={`${isMobile ? "text-xs" : "text-sm"} max-w-md text-gray-600 mb-4`}>{storeDescription}</p>
        <button
          className={`${isMobile ? "text-xs px-3 py-1" : "text-sm px-4 py-2"} rounded-md text-white`}
          style={{ backgroundColor: primaryColor }}
        >
          Shop Now
        </button>
      </div>

      {/* Featured Products */}
      <div
        className={`${isMobile ? "px-3 py-4" : "px-6 py-6"}`}
        style={{ backgroundColor: secondaryColor, color: "#000" }}
      >
        <h2 className={`${isMobile ? "text-lg" : "text-xl"} font-bold mb-3 text-center`}>Featured Products</h2>
        <div className={`grid ${isMobile ? "grid-cols-2 gap-2" : "grid-cols-3 gap-4"}`}>
          {[1, 2, isMobile ? null : 3].filter(Boolean).map((item) => (
            <div key={item} className="bg-white rounded-md overflow-hidden shadow-sm">
              <div className="h-20 bg-gray-100"></div>
              <div className="p-2">
                <h3 className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>Product Name</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold`}>$29.99</span>
                  <button
                    className={`${isMobile ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"} rounded text-white`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`${isMobile ? "px-3 py-3" : "px-6 py-4"} border-t flex items-center justify-between bg-white`}>
        <div className="flex items-center gap-1">
          <CreditCard className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} style={{ color: primaryColor }} />
          <span className={`${isMobile ? "text-[10px]" : "text-xs"} text-gray-500`}>© 2023 {storeName}</span>
        </div>
        {!isMobile && (
          <div className="flex gap-3">
            <span className="text-xs text-gray-500">Terms</span>
            <span className="text-xs text-gray-500">Privacy</span>
            <span className="text-xs text-gray-500">Contact</span>
          </div>
        )}
      </div>
    </div>
  )
}
