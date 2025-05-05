"use client"

import { useState } from "react"
import { Calendar, Download, Filter, Loader2, Package, Search, ShoppingCart, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/animations/page-transition"
import { MotionDiv, MotionLi, MotionUl, itemFade, staggerContainer } from "@/components/animations/motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample order data
const orders: any[] = []

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUpdateOrderOpen, setIsUpdateOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleUpdateStatus = (order: (typeof orders)[0], newStatus: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsUpdateOrderOpen(false)
      // In a real app, you would update the order status in your database
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <PageTransition>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Orders</h1>
          <div className="ml-auto flex items-center gap-2">
            <form className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Completed orders</DropdownMenuItem>
                <DropdownMenuItem>Processing orders</DropdownMenuItem>
                <DropdownMenuItem>Cancelled orders</DropdownMenuItem>
                <DropdownMenuItem>High value (&gt;$100)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Reset filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Date Range</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-1">
                  <CardTitle>Order Overview</CardTitle>
                  <CardDescription>Manage your orders and track their status.</CardDescription>
                </div>
                <div className="ml-auto font-medium">Total: {filteredOrders.length} orders</div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MotionUl variants={staggerContainer} initial="hidden" animate="visible">
                      {filteredOrders.map((order) => (
                        <MotionLi variants={itemFade} key={order.id} className="contents">
                          <TableRow>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>${order.amount.toFixed(2)}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>{order.store}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedOrder(order)
                                      setIsUpdateOrderOpen(true)
                                    }}
                                  >
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        </MotionLi>
                      ))}
                    </MotionUl>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-1">
                  <CardTitle>Completed Orders</CardTitle>
                  <CardDescription>Orders that have been successfully delivered.</CardDescription>
                </div>
                <div className="ml-auto font-medium">
                  Total: {filteredOrders.filter((o) => o.status === "completed").length} completed orders
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MotionUl variants={staggerContainer} initial="hidden" animate="visible">
                      {filteredOrders
                        .filter((order) => order.status === "completed")
                        .map((order) => (
                          <MotionLi variants={itemFade} key={order.id} className="contents">
                            <TableRow>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                              <TableCell>${order.amount.toFixed(2)}</TableCell>
                              <TableCell>{order.store}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </MotionLi>
                        ))}
                    </MotionUl>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="processing" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-1">
                  <CardTitle>Processing Orders</CardTitle>
                  <CardDescription>Orders that are currently being processed.</CardDescription>
                </div>
                <div className="ml-auto font-medium">
                  Total: {filteredOrders.filter((o) => o.status === "processing").length} processing orders
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MotionUl variants={staggerContainer} initial="hidden" animate="visible">
                      {filteredOrders
                        .filter((order) => order.status === "processing")
                        .map((order) => (
                          <MotionLi variants={itemFade} key={order.id} className="contents">
                            <TableRow>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                              <TableCell>${order.amount.toFixed(2)}</TableCell>
                              <TableCell>{order.store}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Update
                                </Button>
                              </TableCell>
                            </TableRow>
                          </MotionLi>
                        ))}
                    </MotionUl>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cancelled" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-1">
                  <CardTitle>Cancelled Orders</CardTitle>
                  <CardDescription>Orders that have been cancelled.</CardDescription>
                </div>
                <div className="ml-auto font-medium">
                  Total: {filteredOrders.filter((o) => o.status === "cancelled").length} cancelled orders
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MotionUl variants={staggerContainer} initial="hidden" animate="visible">
                      {filteredOrders
                        .filter((order) => order.status === "cancelled")
                        .map((order) => (
                          <MotionLi variants={itemFade} key={order.id} className="contents">
                            <TableRow>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                              <TableCell>${order.amount.toFixed(2)}</TableCell>
                              <TableCell>{order.store}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </MotionLi>
                        ))}
                    </MotionUl>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <MotionDiv variants={itemFade}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>
          </MotionDiv>
          <MotionDiv variants={itemFade}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.filter((o) => o.status === "completed").length}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </MotionDiv>
          <MotionDiv variants={itemFade}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.filter((o) => o.status === "processing").length}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </MotionDiv>
          <MotionDiv variants={itemFade}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(orders.reduce((total, order) => total + order.amount, 0) / orders.length).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </MotionDiv>
        </MotionDiv>

        <Dialog open={isUpdateOrderOpen} onOpenChange={setIsUpdateOrderOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status of order {selectedOrder?.id} for {selectedOrder?.customer}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedOrder?.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input id="notes" placeholder="Add notes about this update" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateOrderOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateStatus(selectedOrder!, "completed")} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </PageTransition>
  )
}
