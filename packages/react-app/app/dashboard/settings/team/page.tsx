"use client"

import { useState } from "react"
import { Check, Mail, Plus, RefreshCw, Shield, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageTransition } from "@/components/animations/page-transition"
import { MotionDiv, itemFade, staggerContainer } from "@/components/animations/motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

// Sample team members data
const teamMembers = [
  {
    id: "user_1",
    name: "John Smith",
    email: "john@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "user_2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "manager",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "user_3",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "staff",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "pending",
    lastActive: "Never",
  },
  {
    id: "user_4",
    name: "Aisha Patel",
    email: "aisha@example.com",
    role: "staff",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastActive: "3 days ago",
  },
]

// Role definitions
const roles = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all settings and features",
    permissions: ["manage_team", "manage_billing", "manage_products", "manage_orders", "view_analytics"],
  },
  {
    id: "manager",
    name: "Store Manager",
    description: "Can manage products, orders, and view analytics",
    permissions: ["manage_products", "manage_orders", "view_analytics"],
  },
  {
    id: "staff",
    name: "Staff Member",
    description: "Can view and fulfill orders only",
    permissions: ["view_orders", "fulfill_orders"],
  },
]

export default function TeamPage() {
  const [isInviting, setIsInviting] = useState(false)
  const [invitation, setInvitation] = useState({ email: "", role: "staff" })
  const [members, setMembers] = useState(teamMembers)

  const handleInviteMember = () => {
    if (!invitation.email) {
      toast.error("Missing email")
      return
    }

    setIsInviting(true)

    // Simulate API call
    setTimeout(() => {
      setIsInviting(false)
      setInvitation({ email: "", role: "staff" })

      toast.success("Invitation sent")
    }, 1500)
  }

  const handleResendInvitation = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)

    toast.success("Invitation resent to " + member?.email)
  }

  const handleRemoveMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    setMembers(members.filter((m) => m.id !== memberId))

    toast.success("Team member removed")
  }

  const handleChangeRole = (memberId: string, newRole: string) => {
    setMembers(members.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))

    toast.success("Role updated")
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>
      case "staff":
        return <Badge className="bg-green-500">Staff</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members and their access permissions.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team. They&apos;ll receive an email with instructions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={invitation.email}
                    onChange={(e) => setInvitation({ ...invitation, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={invitation.role}
                    onValueChange={(value) => setInvitation({ ...invitation, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {roles.find((r) => r.id === invitation.role)?.description}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInvitation({ email: "", role: "staff" })}>
                  Cancel
                </Button>
                <Button onClick={handleInviteMember} disabled={isInviting}>
                  {isInviting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <MotionDiv variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
              {members.map((member) => (
                <MotionDiv key={member.id} variants={itemFade}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <div className="mt-1 flex items-center gap-2">
                              {getRoleBadge(member.role)}
                              {getStatusBadge(member.status)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.status === "pending" ? (
                            <Button variant="outline" size="sm" onClick={() => handleResendInvitation(member.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Resend
                            </Button>
                          ) : (
                            <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
                          )}
                          <Select
                            defaultValue={member.role}
                            onValueChange={(value) => handleChangeRole(member.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </MotionDiv>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles and Permissions</CardTitle>
            <CardDescription>Define what each role can access in your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {roles.map((role) => (
                <div key={role.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{role.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {permission.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Customize Roles</Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  )
}
