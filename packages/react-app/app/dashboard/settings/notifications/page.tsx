"use client"

import { useState } from "react"
import { Bell, Mail, Save, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PageTransition } from "@/components/animations/page-transition"
import { MotionDiv, itemFade, staggerContainer } from "@/components/animations/motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function NotificationsPage() {
  const [emailSettings, setEmailSettings] = useState({
    newOrder: true,
    orderStatusUpdate: true,
    lowInventory: true,
    paymentReceived: true,
    weeklyReport: true,
    marketingUpdates: false,
  })

  const [pushSettings, setPushSettings] = useState({
    newOrder: true,
    orderStatusUpdate: true,
    lowInventory: true,
    paymentReceived: true,
    customerMessages: true,
  })

  const [smsSettings, setSmsSettings] = useState({
    newOrder: false,
    orderStatusUpdate: false,
    lowInventory: false,
    paymentReceived: false,
  })

  const handleSaveSettings = () => {
    toast.success("Notification settings saved")
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
            <p className="text-muted-foreground">Manage how and when you receive notifications.</p>
          </div>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="push" className="gap-2">
              <Bell className="h-4 w-4" />
              Push
            </TabsTrigger>
            <TabsTrigger value="sms" className="gap-2">
              <Smartphone className="h-4 w-4" />
              SMS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <MotionDiv variants={staggerContainer} initial="hidden" animate="visible">
              <MotionDiv variants={itemFade}>
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Configure which emails you receive from MiniPay.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-new-order">New Order</Label>
                        <p className="text-sm text-muted-foreground">Receive an email when a new order is placed.</p>
                      </div>
                      <Switch
                        id="email-new-order"
                        checked={emailSettings.newOrder}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, newOrder: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-order-status">Order Status Updates</Label>
                        <p className="text-sm text-muted-foreground">Receive emails when an order status changes.</p>
                      </div>
                      <Switch
                        id="email-order-status"
                        checked={emailSettings.orderStatusUpdate}
                        onCheckedChange={(checked) =>
                          setEmailSettings({ ...emailSettings, orderStatusUpdate: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-low-inventory">Low Inventory Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when product inventory is running low.
                        </p>
                      </div>
                      <Switch
                        id="email-low-inventory"
                        checked={emailSettings.lowInventory}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, lowInventory: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-payment">Payment Received</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive an email when a payment is processed successfully.
                        </p>
                      </div>
                      <Switch
                        id="email-payment"
                        checked={emailSettings.paymentReceived}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, paymentReceived: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-weekly-report">Weekly Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly summary of your store's performance.
                        </p>
                      </div>
                      <Switch
                        id="email-weekly-report"
                        checked={emailSettings.weeklyReport}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, weeklyReport: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-marketing">Marketing Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features, tips, and promotions.
                        </p>
                      </div>
                      <Switch
                        id="email-marketing"
                        checked={emailSettings.marketingUpdates}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, marketingUpdates: checked })}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="email-address">Email Address for Notifications</Label>
                      <Input id="email-address" type="email" defaultValue="john@example.com" />
                      <p className="text-xs text-muted-foreground">
                        This is where all email notifications will be sent.
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </MotionDiv>
            </MotionDiv>
          </TabsContent>

          <TabsContent value="push" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Configure browser and mobile push notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-new-order">New Order</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a push notification when a new order is placed.
                    </p>
                  </div>
                  <Switch
                    id="push-new-order"
                    checked={pushSettings.newOrder}
                    onCheckedChange={(checked) => setPushSettings({ ...pushSettings, newOrder: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-order-status">Order Status Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications when an order status changes.
                    </p>
                  </div>
                  <Switch
                    id="push-order-status"
                    checked={pushSettings.orderStatusUpdate}
                    onCheckedChange={(checked) => setPushSettings({ ...pushSettings, orderStatusUpdate: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-low-inventory">Low Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get push notifications when product inventory is running low.
                    </p>
                  </div>
                  <Switch
                    id="push-low-inventory"
                    checked={pushSettings.lowInventory}
                    onCheckedChange={(checked) => setPushSettings({ ...pushSettings, lowInventory: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-payment">Payment Received</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a push notification when a payment is processed successfully.
                    </p>
                  </div>
                  <Switch
                    id="push-payment"
                    checked={pushSettings.paymentReceived}
                    onCheckedChange={(checked) => setPushSettings({ ...pushSettings, paymentReceived: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-customer-messages">Customer Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified when customers send you messages.</p>
                  </div>
                  <Switch
                    id="push-customer-messages"
                    checked={pushSettings.customerMessages}
                    onCheckedChange={(checked) => setPushSettings({ ...pushSettings, customerMessages: checked })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="space-y-2 w-full">
                  <Label>Device Management</Label>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Chrome on Windows</p>
                        <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-xs text-muted-foreground">Last active: 1 day ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMS Notifications</CardTitle>
                <CardDescription>Configure text message notifications (additional charges may apply).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-new-order">New Order</Label>
                    <p className="text-sm text-muted-foreground">Receive a text message when a new order is placed.</p>
                  </div>
                  <Switch
                    id="sms-new-order"
                    checked={smsSettings.newOrder}
                    onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, newOrder: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-order-status">Order Status Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive text messages when an order status changes.</p>
                  </div>
                  <Switch
                    id="sms-order-status"
                    checked={smsSettings.orderStatusUpdate}
                    onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, orderStatusUpdate: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-low-inventory">Low Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get text notifications when product inventory is running low.
                    </p>
                  </div>
                  <Switch
                    id="sms-low-inventory"
                    checked={smsSettings.lowInventory}
                    onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, lowInventory: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-payment">Payment Received</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a text message when a payment is processed successfully.
                    </p>
                  </div>
                  <Switch
                    id="sms-payment"
                    checked={smsSettings.paymentReceived}
                    onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, paymentReceived: checked })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="space-y-2 w-full">
                  <Label htmlFor="phone-number">Phone Number for SMS</Label>
                  <Input id="phone-number" type="tel" placeholder="+1 (555) 123-4567" />
                  <p className="text-xs text-muted-foreground">
                    Standard messaging rates may apply based on your carrier.
                  </p>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Preferences</CardTitle>
                <CardDescription>Additional settings for SMS notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-time-start">Quiet Hours Start</Label>
                  <Select defaultValue="22:00">
                    <SelectTrigger id="sms-time-start">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                      <SelectItem value="21:00">9:00 PM</SelectItem>
                      <SelectItem value="22:00">10:00 PM</SelectItem>
                      <SelectItem value="23:00">11:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-time-end">Quiet Hours End</Label>
                  <Select defaultValue="08:00">
                    <SelectTrigger id="sms-time-end">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    You won't receive SMS notifications during quiet hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
