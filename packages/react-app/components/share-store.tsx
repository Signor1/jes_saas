"use client"

import type React from "react"

import { useState } from "react"
import { Copy, Facebook, Link, Mail, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface ShareStoreProps {
  storeName: string
  storeSlug: string
  children?: React.ReactNode
}

export function ShareStore({ storeName, storeSlug, children }: ShareStoreProps) {
  const [open, setOpen] = useState(false)
  const storeUrl =
    typeof window !== "undefined" ? `${window.location.origin}/store/${storeSlug}` : `/store/${storeSlug}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storeUrl)
    toast.success("Link copied!, You can now share it with your customers.")
  }

  const shareOnSocialMedia = (platform: string) => {
    let shareUrl = ""
    const text = `Check out my store: ${storeName}`

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(storeUrl)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(`Check out ${storeName}`)}&body=${encodeURIComponent(
          `I thought you might be interested in my store: ${storeUrl}`,
        )}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || <Button variant="outline">Share Store</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your store</DialogTitle>
          <DialogDescription>
            Share your store link with customers via social media, email, or direct link.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="mt-4">
            <div className="flex items-center space-x-2">
              <Input value={storeUrl} readOnly className="flex-1" />
              <Button size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Share this link with your customers to let them access your store.
            </p>
          </TabsContent>
          <TabsContent value="social" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="w-full" onClick={() => shareOnSocialMedia("facebook")}>
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button variant="outline" className="w-full" onClick={() => shareOnSocialMedia("twitter")}>
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" className="w-full" onClick={() => shareOnSocialMedia("email")}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Share your store directly to social media platforms or via email.
            </p>
          </TabsContent>
          <TabsContent value="embed" className="mt-4">
            <div className="space-y-2">
              <p className="text-sm">Embed this code on your website:</p>
              <div className="rounded-md bg-muted p-2">
                <code className="text-xs">
                  {`<a href="${storeUrl}" target="_blank">Visit my ${storeName} store</a>`}
                </code>
              </div>
              <Button variant="outline" className="w-full" onClick={() => copyToClipboard()}>
                <Link className="mr-2 h-4 w-4" />
                Copy Embed Code
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
