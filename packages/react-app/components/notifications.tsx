"use client"

import { useState, useEffect } from "react"
import { Bell, Check, ShoppingBag, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "order" | "stock" | "system"
  read: boolean
  createdAt: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch notifications from an API
    // For demo purposes, we'll use localStorage or create sample data
    const storedNotifications = localStorage.getItem("notifications")
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    } else {
      // Create sample notifications for demo
      const sampleNotifications: Notification[] = [
        {
          id: "notif_" + Math.random().toString(36).substring(2, 9),
          title: "New Order Received",
          message: "You have received a new order for Premium T-Shirt (2 items).",
          type: "order",
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "notif_" + Math.random().toString(36).substring(2, 9),
          title: "Low Stock Alert",
          message: "Fitness Tracker is running low on stock (3 remaining).",
          type: "stock",
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: "notif_" + Math.random().toString(36).substring(2, 9),
          title: "Welcome to MiniPay",
          message: "Thank you for joining MiniPay! Set up your store to start selling.",
          type: "system",
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ]
      setNotifications(sampleNotifications)
      localStorage.setItem("notifications", JSON.stringify(sampleNotifications))
    }
  }, [])

  // Add a new notification (used when a purchase is made)
  const addNotification = (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      id: "notif_" + Math.random().toString(36).substring(2, 9),
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    }

    const updatedNotifications = [newNotification, ...notifications]
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  // Mark a notification as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  // Delete a notification
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id)
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  // Get unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get icon for notification type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4 text-blue-500" />
      case "stock":
        return (
          <Badge variant="outline" className="px-1 text-amber-500 border-amber-200 bg-amber-50">
            Low
          </Badge>
        )
      case "system":
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <div className="font-medium">Notifications</div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-muted/30",
                  )}
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Separator />
        <div className="p-4 text-center">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href="/dashboard/notifications">View all notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Export a function to add notifications from other components
export function useNotifications() {
  const addNotification = (notification: {
    title: string
    message: string
    type: "order" | "stock" | "system"
  }) => {
    // Get existing notifications
    const storedNotifications = localStorage.getItem("notifications")
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : []

    // Add new notification
    const newNotification = {
      id: "notif_" + Math.random().toString(36).substring(2, 9),
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    }

    notifications = [newNotification, ...notifications]

    // Save to localStorage
    localStorage.setItem("notifications", JSON.stringify(notifications))

    return newNotification
  }

  return { addNotification }
}
