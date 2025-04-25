"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Download,
  LineChart,
  Package,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   Chart,
//   ChartContainer,
//   ChartGrid,
//   ChartLine,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartXAxis,
//   ChartYAxis,
// } from "@/components/ui/chart"
import { PageTransition } from "@/components/animations/page-transition"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("7d")

  // Sample data for the dashboard
  const recentOrders = [
    { id: "ORD-001", customer: "John Smith", date: "2023-04-20", amount: 125.99, status: "Completed" },
    { id: "ORD-002", customer: "Sarah Johnson", date: "2023-04-19", amount: 89.5, status: "Processing" },
    { id: "ORD-003", customer: "Michael Chen", date: "2023-04-18", amount: 245.0, status: "Completed" },
    { id: "ORD-004", customer: "Aisha Patel", date: "2023-04-17", amount: 65.25, status: "Completed" },
    { id: "ORD-005", customer: "Robert Garcia", date: "2023-04-16", amount: 178.75, status: "Processing" },
  ]

  const salesData = [
    { date: "Apr 14", value: 120 },
    { date: "Apr 15", value: 180 },
    { date: "Apr 16", value: 150 },
    { date: "Apr 17", value: 250 },
    { date: "Apr 18", value: 300 },
    { date: "Apr 19", value: 280 },
    { date: "Apr 20", value: 350 },
  ]

  const topProducts = [
    { name: "Premium T-Shirt", sales: 124, revenue: 3720 },
    { name: "Wireless Earbuds", sales: 98, revenue: 4900 },
    { name: "Leather Wallet", sales: 85, revenue: 2550 },
    { name: "Fitness Tracker", sales: 72, revenue: 5040 },
    { name: "Phone Case", sales: 65, revenue: 1300 },
  ]

  const topStores = [
    { name: "Fashion Boutique", orders: 87, revenue: 6540 },
    { name: "Tech Gadgets", orders: 65, revenue: 8900 },
    { name: "Home Essentials", orders: 54, revenue: 4320 },
    { name: "Sports Equipment", orders: 43, revenue: 3870 },
    { name: "Beauty Products", orders: 38, revenue: 2980 },
  ]

  return (
    <PageTransition>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Tabs value={dateRange} onValueChange={setDateRange} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="7d" className="flex-1 md:flex-none">
                  7d
                </TabsTrigger>
                <TabsTrigger value="30d" className="flex-1 md:flex-none">
                  30d
                </TabsTrigger>
                <TabsTrigger value="90d" className="flex-1 md:flex-none">
                  90d
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="h-8 gap-1 w-full md:w-auto">
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full md:w-auto overflow-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$15,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">+12.4% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2,338</div>
                  <p className="text-xs text-muted-foreground">+18.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">+5.1% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4">
                <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <div>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Daily revenue for the past week</CardDescription>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="h-8 w-full md:w-auto">
                      <LineChart className="mr-2 h-3.5 w-3.5" />
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                {/* <CardContent className="pl-2">
                  <Chart className="h-[300px]">
                    <ChartContainer>
                      <ChartGrid x={false} />
                      <ChartYAxis />
                      <ChartXAxis />
                      <ChartLine
                        data={salesData}
                        x={(d) => d.date}
                        y={(d) => d.value}
                        strokeWidth={2}
                        className="stroke-primary"
                      />
                      <ChartTooltip>
                        {({ point }) => (
                          <ChartTooltipContent>
                            <div className="flex flex-col gap-2">
                              <div className="text-sm font-medium">{point.data.date}</div>
                              <div className="text-sm font-bold">${point.data.value}</div>
                            </div>
                          </ChartTooltipContent>
                        )}
                      </ChartTooltip>
                    </ChartContainer>
                  </Chart>
                </CardContent> */}
              </Card>
              <Card className="col-span-full lg:col-span-3">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Your best performing products this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {topProducts.map((product, index) => (
                      <li key={product.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                          </div>
                        </div>
                        <p className="font-medium">${product.revenue}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/products">View All Products</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>You have {recentOrders.length} orders this week.</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full md:w-auto">
                  <Link href="/dashboard/orders">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="px-0 sm:px-6">
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>${order.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                order.status === "Completed"
                                  ? "bg-green-500"
                                  : order.status === "Processing"
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/orders/${order.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$42.50</div>
                  <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Repeat Purchase Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.3%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cart Abandonment</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68.7%</div>
                  <p className="text-xs text-muted-foreground">-3.4% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4%</div>
                  <p className="text-xs text-muted-foreground">-0.8% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your customers are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        <p className="text-sm font-medium">Direct</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">45%</p>
                        <p className="text-xs text-muted-foreground">+5.2%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                        <p className="text-sm font-medium">Social Media</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">32%</p>
                        <p className="text-xs text-muted-foreground">+12.3%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500"></div>
                        <p className="text-sm font-medium">Search</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">18%</p>
                        <p className="text-xs text-muted-foreground">+3.7%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                        <p className="text-sm font-medium">Referral</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">5%</p>
                        <p className="text-xs text-muted-foreground">+1.2%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-full lg:col-span-3">
                <CardHeader>
                  <CardTitle>Customer Demographics</CardTitle>
                  <CardDescription>Age and gender distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Age Groups</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs w-16">18-24</p>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: "15%" }}></div>
                          </div>
                          <p className="text-xs">15%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs w-16">25-34</p>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: "42%" }}></div>
                          </div>
                          <p className="text-xs">42%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs w-16">35-44</p>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: "25%" }}></div>
                          </div>
                          <p className="text-xs">25%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs w-16">45-54</p>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: "12%" }}></div>
                          </div>
                          <p className="text-xs">12%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs w-16">55+</p>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: "6%" }}></div>
                          </div>
                          <p className="text-xs">6%</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Gender</h4>
                      <div className="flex gap-4">
                        <div className="flex-1 p-4 border rounded-md text-center">
                          <p className="text-2xl font-bold">48%</p>
                          <p className="text-sm text-muted-foreground">Male</p>
                        </div>
                        <div className="flex-1 p-4 border rounded-md text-center">
                          <p className="text-2xl font-bold">52%</p>
                          <p className="text-sm text-muted-foreground">Female</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>Download detailed reports for your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md gap-4">
                    <div className="flex items-center gap-4">
                      <BarChart3 className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Sales Report</h3>
                        <p className="text-sm text-muted-foreground">Detailed breakdown of all sales</p>
                      </div>
                    </div>
                    <Button variant="outline" className="gap-1 w-full md:w-auto">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md gap-4">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Customer Report</h3>
                        <p className="text-sm text-muted-foreground">Customer acquisition and retention</p>
                      </div>
                    </div>
                    <Button variant="outline" className="gap-1 w-full md:w-auto">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md gap-4">
                    <div className="flex items-center gap-4">
                      <Package className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-medium">Inventory Report</h3>
                        <p className="text-sm text-muted-foreground">Stock levels and product performance</p>
                      </div>
                    </div>
                    <Button variant="outline" className="gap-1 w-full md:w-auto">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md gap-4">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-8 w-8 text-amber-500" />
                      <div>
                        <h3 className="font-medium">Payment Report</h3>
                        <p className="text-sm text-muted-foreground">Transaction details and payment methods</p>
                      </div>
                    </div>
                    <Button variant="outline" className="gap-1 w-full md:w-auto">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Performance</CardTitle>
                <CardDescription>Compare performance across your stores</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6">
                  {topStores.map((store, index) => (
                    <li key={store.name}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{store.name}</p>
                            <p className="text-xs text-muted-foreground">{store.orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${store.revenue}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(store.revenue / 8900) * 100}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/stores">View All Stores</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
