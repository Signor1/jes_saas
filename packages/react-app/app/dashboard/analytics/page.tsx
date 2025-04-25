"use client"

import { useState } from "react"
import { BarChart3, Calendar, CreditCard, DollarSign, LineChart, PieChart, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { MotionDiv, itemFade, staggerContainer } from "@/components/animations/motion"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("7d")

  // Sample data for the dashboard
  const salesData = [
    { date: "Apr 14", value: 120 },
    { date: "Apr 15", value: 180 },
    { date: "Apr 16", value: 150 },
    { date: "Apr 17", value: 250 },
    { date: "Apr 18", value: 300 },
    { date: "Apr 19", value: 280 },
    { date: "Apr 20", value: 350 },
  ]

  const visitorData = [
    { date: "Apr 14", value: 320 },
    { date: "Apr 15", value: 380 },
    { date: "Apr 16", value: 450 },
    { date: "Apr 17", value: 550 },
    { date: "Apr 18", value: 500 },
    { date: "Apr 19", value: 480 },
    { date: "Apr 20", value: 650 },
  ]

  const conversionData = [
    { date: "Apr 14", value: 2.5 },
    { date: "Apr 15", value: 3.2 },
    { date: "Apr 16", value: 2.8 },
    { date: "Apr 17", value: 3.5 },
    { date: "Apr 18", value: 4.0 },
    { date: "Apr 19", value: 3.8 },
    { date: "Apr 20", value: 4.2 },
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
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Analytics Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <Tabs value={dateRange} onValueChange={setDateRange} className="mr-4">
              <TabsList>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Date Range</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <LineChart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <MotionDiv
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <MotionDiv variants={itemFade}>
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
              </MotionDiv>
              <MotionDiv variants={itemFade}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+12.4% from last month</p>
                  </CardContent>
                </Card>
              </MotionDiv>
              <MotionDiv variants={itemFade}>
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
              </MotionDiv>
              <MotionDiv variants={itemFade}>
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
              </MotionDiv>
            </MotionDiv>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <Chart className="h-[300px]">
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
                  </Chart> */}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Your best performing products this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <MotionDiv variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                    {topProducts.map((product, index) => (
                      <MotionDiv key={product.name} variants={itemFade} className="flex items-center justify-between">
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
                      </MotionDiv>
                    ))}
                  </MotionDiv>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Visitors</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <Chart className="h-[300px]">
                    <ChartContainer>
                      <ChartGrid x={false} />
                      <ChartYAxis />
                      <ChartXAxis />
                      <ChartLine
                        data={visitorData}
                        x={(d) => d.date}
                        y={(d) => d.value}
                        strokeWidth={2}
                        className="stroke-blue-500"
                      />
                      <ChartTooltip>
                        {({ point }) => (
                          <ChartTooltipContent>
                            <div className="flex flex-col gap-2">
                              <div className="text-sm font-medium">{point.data.date}</div>
                              <div className="text-sm font-bold">{point.data.value} visitors</div>
                            </div>
                          </ChartTooltipContent>
                        )}
                      </ChartTooltip>
                    </ChartContainer>
                  </Chart> */}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Stores</CardTitle>
                  <CardDescription>Your best performing stores this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <MotionDiv variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                    {topStores.map((store, index) => (
                      <MotionDiv key={store.name} variants={itemFade} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{store.name}</p>
                            <p className="text-xs text-muted-foreground">{store.orders} orders</p>
                          </div>
                        </div>
                        <p className="font-medium">${store.revenue}</p>
                      </MotionDiv>
                    ))}
                  </MotionDiv>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <Chart className="h-[300px]">
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
                  </Chart> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <Chart className="h-[300px]">
                    <ChartContainer>
                      <ChartGrid x={false} />
                      <ChartYAxis />
                      <ChartXAxis />
                      <ChartLine
                        data={conversionData}
                        x={(d) => d.date}
                        y={(d) => d.value}
                        strokeWidth={2}
                        className="stroke-green-500"
                      />
                      <ChartTooltip>
                        {({ point }) => (
                          <ChartTooltipContent>
                            <div className="flex flex-col gap-2">
                              <div className="text-sm font-medium">{point.data.date}</div>
                              <div className="text-sm font-bold">{point.data.value}%</div>
                            </div>
                          </ChartTooltipContent>
                        )}
                      </ChartTooltip>
                    </ChartContainer>
                  </Chart> */}
                </CardContent>
              </Card>
            </div>
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
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68.7%</div>
                  <p className="text-xs text-muted-foreground">-3.4% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4%</div>
                  <p className="text-xs text-muted-foreground">-0.8% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>View detailed metrics for your products</CardDescription>
              </CardHeader>
              <CardContent>
                <MotionDiv variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                  {topProducts.map((product, index) => (
                    <MotionDiv key={product.name} variants={itemFade}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${product.revenue}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(product.sales / 124) * 100}%` }}
                        ></div>
                      </div>
                    </MotionDiv>
                  ))}
                </MotionDiv>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Performance</CardTitle>
                <CardDescription>View detailed metrics for your stores</CardDescription>
              </CardHeader>
              <CardContent>
                <MotionDiv variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                  {topStores.map((store, index) => (
                    <MotionDiv key={store.name} variants={itemFade}>
                      <div className="flex items-center justify-between mb-2">
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
                    </MotionDiv>
                  ))}
                </MotionDiv>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </PageTransition>
  )
}
