"use client"

import { useState } from "react"
import { Check, Edit, MapPin, Plus, Save, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PageTransition } from "@/components/animations/page-transition"
import { MotionDiv, itemFade, staggerContainer } from "@/components/animations/motion"
import { toast } from "sonner"

export default function DeliveryPage() {
  const [deliveryMethod, setDeliveryMethod] = useState("flat")
  const [enableDelivery, setEnableDelivery] = useState(true)
  const [flatRate, setFlatRate] = useState("5.00")
  const [freeThreshold, setFreeThreshold] = useState("50.00")
  const [enableFreeDelivery, setEnableFreeDelivery] = useState(true)
  const [deliveryZones, setDeliveryZones] = useState([
    { id: "zone1", name: "Local", rate: "3.00", areas: "Downtown, Central Business District" },
    { id: "zone2", name: "Suburban", rate: "5.00", areas: "North Side, East End, West Hills" },
    { id: "zone3", name: "Rural", rate: "10.00", areas: "Outskirts, Countryside" },
  ])
  const [editingZone, setEditingZone] = useState<string | null>(null)
  const [newZone, setNewZone] = useState({ name: "", rate: "", areas: "" })

  const handleSaveSettings = () => {
    toast.success("Delivery settings saved, Your delivery settings have been updated successfully.")
  }

  const handleAddZone = () => {
    if (!newZone.name || !newZone.rate) return

    setDeliveryZones([
      ...deliveryZones,
      {
        id: `zone${deliveryZones.length + 1}`,
        name: newZone.name,
        rate: newZone.rate,
        areas: newZone.areas,
      },
    ])
    setNewZone({ name: "", rate: "", areas: "" })
  }

  const handleEditZone = (id: string) => {
    setEditingZone(id)
  }

  const handleSaveZone = (id: string) => {
    setEditingZone(null)
  }

  const handleDeleteZone = (id: string) => {
    setDeliveryZones(deliveryZones.filter((zone) => zone.id !== id))
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Delivery Settings</h1>
            <p className="text-muted-foreground">Configure how you deliver products to your customers.</p>
          </div>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="settings">Delivery Settings</TabsTrigger>
            <TabsTrigger value="zones">Delivery Zones</TabsTrigger>
            <TabsTrigger value="options">Delivery Options</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <MotionDiv variants={staggerContainer} initial="hidden" animate="visible">
              <MotionDiv variants={itemFade}>
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Configuration</CardTitle>
                    <CardDescription>Configure your store's delivery settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-delivery">Enable Delivery</Label>
                        <p className="text-sm text-muted-foreground">Turn on delivery services for your customers.</p>
                      </div>
                      <Switch id="enable-delivery" checked={enableDelivery} onCheckedChange={setEnableDelivery} />
                    </div>

                    <div className="space-y-4">
                      <Label>Delivery Pricing Method</Label>
                      <RadioGroup
                        value={deliveryMethod}
                        onValueChange={setDeliveryMethod}
                        className="grid gap-4 sm:grid-cols-3"
                      >
                        <div>
                          <RadioGroupItem value="flat" id="flat" className="peer sr-only" />
                          <Label
                            htmlFor="flat"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Truck className="mb-3 h-6 w-6" />
                            <div className="font-medium">Flat Rate</div>
                            <div className="text-center text-sm text-muted-foreground">
                              Charge the same delivery fee for all orders.
                            </div>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="zones" id="zones" className="peer sr-only" />
                          <Label
                            htmlFor="zones"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <MapPin className="mb-3 h-6 w-6" />
                            <div className="font-medium">Delivery Zones</div>
                            <div className="text-center text-sm text-muted-foreground">
                              Set different rates based on delivery location.
                            </div>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="free" id="free" className="peer sr-only" />
                          <Label
                            htmlFor="free"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Check className="mb-3 h-6 w-6" />
                            <div className="font-medium">Free Delivery</div>
                            <div className="text-center text-sm text-muted-foreground">
                              Offer free delivery on all orders.
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {deliveryMethod === "flat" && (
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="flat-rate">Flat Rate Delivery Fee</Label>
                          <div className="flex items-center">
                            <span className="mr-2">$</span>
                            <Input
                              id="flat-rate"
                              type="number"
                              min="0"
                              step="0.01"
                              value={flatRate}
                              onChange={(e) => setFlatRate(e.target.value)}
                              className="max-w-[120px]"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">This amount will be added to all orders.</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="free-threshold">Free Delivery Threshold</Label>
                              <p className="text-sm text-muted-foreground">
                                Orders above this amount qualify for free delivery.
                              </p>
                            </div>
                            <Switch
                              id="enable-free-delivery"
                              checked={enableFreeDelivery}
                              onCheckedChange={setEnableFreeDelivery}
                            />
                          </div>
                          {enableFreeDelivery && (
                            <div className="flex items-center">
                              <span className="mr-2">$</span>
                              <Input
                                id="free-threshold"
                                type="number"
                                min="0"
                                step="0.01"
                                value={freeThreshold}
                                onChange={(e) => setFreeThreshold(e.target.value)}
                                className="max-w-[120px]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>Save Delivery Settings</Button>
                  </CardFooter>
                </Card>
              </MotionDiv>
            </MotionDiv>
          </TabsContent>

          <TabsContent value="zones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Zones</CardTitle>
                <CardDescription>Create delivery zones with different rates based on location.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <MotionDiv variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                  {deliveryZones.map((zone) => (
                    <MotionDiv key={zone.id} variants={itemFade}>
                      <Card>
                        <CardContent className="p-4">
                          {editingZone === zone.id ? (
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor={`zone-name-${zone.id}`}>Zone Name</Label>
                                <Input id={`zone-name-${zone.id}`} defaultValue={zone.name} className="max-w-[300px]" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`zone-rate-${zone.id}`}>Delivery Rate</Label>
                                <div className="flex items-center">
                                  <span className="mr-2">$</span>
                                  <Input
                                    id={`zone-rate-${zone.id}`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    defaultValue={zone.rate}
                                    className="max-w-[120px]"
                                  />
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`zone-areas-${zone.id}`}>Areas Covered</Label>
                                <Textarea
                                  id={`zone-areas-${zone.id}`}
                                  defaultValue={zone.areas}
                                  placeholder="List areas covered by this zone, separated by commas"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleSaveZone(zone.id)}>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingZone(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{zone.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  ${zone.rate} - {zone.areas}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleEditZone(zone.id)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive"
                                  onClick={() => handleDeleteZone(zone.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                  </svg>
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </MotionDiv>
                  ))}
                </MotionDiv>

                <Card>
                  <CardHeader>
                    <CardTitle>Add New Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-zone-name">Zone Name</Label>
                      <Input
                        id="new-zone-name"
                        value={newZone.name}
                        onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                        placeholder="e.g., Downtown"
                        className="max-w-[300px]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-zone-rate">Delivery Rate</Label>
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <Input
                          id="new-zone-rate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newZone.rate}
                          onChange={(e) => setNewZone({ ...newZone, rate: e.target.value })}
                          placeholder="0.00"
                          className="max-w-[120px]"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-zone-areas">Areas Covered</Label>
                      <Textarea
                        id="new-zone-areas"
                        value={newZone.areas}
                        onChange={(e) => setNewZone({ ...newZone, areas: e.target.value })}
                        placeholder="List areas covered by this zone, separated by commas"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddZone}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Zone
                    </Button>
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="options" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
                <CardDescription>Configure additional delivery settings and options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Collect Delivery Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Require customers to provide a delivery address during checkout.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Delivery Notes</Label>
                      <p className="text-sm text-muted-foreground">
                        Let customers add special instructions for delivery.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Estimated Delivery Time</Label>
                      <p className="text-sm text-muted-foreground">Show estimated delivery time to customers.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery-time">Default Delivery Time</Label>
                  <Select defaultValue="1-3">
                    <SelectTrigger id="delivery-time" className="w-[200px]">
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="same-day">Same day delivery</SelectItem>
                      <SelectItem value="1-3">1-3 business days</SelectItem>
                      <SelectItem value="3-5">3-5 business days</SelectItem>
                      <SelectItem value="5-7">5-7 business days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">This will be shown to customers during checkout.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery-message">Custom Delivery Message</Label>
                  <Textarea
                    id="delivery-message"
                    placeholder="Enter a custom message about your delivery service"
                    defaultValue="We deliver to your doorstep with care. Please ensure someone is available to receive the package."
                  />
                  <p className="text-sm text-muted-foreground">
                    This message will be displayed during checkout and in order confirmation emails.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Options</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
