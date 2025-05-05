import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/context/theme-context"
import { Toaster } from "@/components/ui/sonner"


export const metadata = {
  title: "MiniPay Merchant Platform",
  description: "Accept payments with MiniPay",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors />
      </>
  )
}
