"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, LineChart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PageTransition } from "@/components/animations/page-transition";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");

  // Sample data for the dashboard
  const recentOrders: any[] = [];

  const topProducts: any[] = [];

  const topStores: any[] = [];

  return (
    <PageTransition>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Tabs
              value={dateRange}
              onValueChange={setDateRange}
              className="w-full md:w-auto"
            >
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
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 w-full md:w-auto"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="w-full md:w-auto overflow-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4">
                <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <div>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>
                      Daily revenue for the past week
                    </CardDescription>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-full md:w-auto"
                    >
                      <LineChart className="mr-2 h-3.5 w-3.5" />
                      View Details
                    </Button>
                  </div>
                </CardHeader>
              </Card>
              <Card className="col-span-full lg:col-span-3">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Your best performing products this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {topProducts.map((product, index) => (
                      <li
                        key={product.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.sales} sales
                            </p>
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
                  <CardDescription>
                    You have {recentOrders.length} orders this week.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full md:w-auto"
                >
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
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            {new Date(order.date).toLocaleDateString()}
                          </TableCell>
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
                              <Link href={`/dashboard/orders/${order.id}`}>
                                View
                              </Link>
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

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Performance</CardTitle>
                <CardDescription>
                  Compare performance across your stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6">
                  {topStores.map((store, index) => (
                    <li key={store.name}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{store.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {store.orders} orders
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${store.revenue}</p>
                          <p className="text-xs text-muted-foreground">
                            Revenue
                          </p>
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
  );
}
