"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { User, LogOut } from "lucide-react"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { NotificationCenter } from "@/components/notifications"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MotionDiv, fadeIn } from "@/components/animations/motion"
import { toast } from "sonner"

interface UserType {
  id: string
  name: string
  email: string
  storeName: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    // Clear login state
    localStorage.removeItem("isLoggedIn")

    toast.success("Logged out, You are now logged out.")

    // Redirect to home page
    window.location.href = "/"
  }

  // if (!isMounted || !user) {
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center">
  //       <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr]">
        <MotionDiv variants={fadeIn} initial="hidden" animate="visible">
          <DashboardSidebar />
        </MotionDiv>
        <div className="flex flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
