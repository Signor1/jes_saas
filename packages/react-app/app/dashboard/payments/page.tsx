"use client"

import { useState } from "react"
import {
  BanknoteIcon,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Plus,
  RefreshCw,
  Settings,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/animations/page-transition"
import { MotionDiv, itemFade, staggerContainer } from "@/components/animations/motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MotionUl, MotionLi } from "@/components/animations/motion"
import { toast } from "sonner"

export default function PaymentsPage() {
  const [isConnectingPayment, setIsConnectingPayment] = useState(false)
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [newAccount, setNewAccount] = useState({ name: "", number: "", bank: "" })

  // Sample payment methods
  const paymentMethods = [
    {
      id: "minipay",
      name: "MiniPay",
      status: "active",
      connected: true,
      icon: <Wallet className="h-8 w-8 text-primary" />,
    },
    {
      id: "bank",
      name: "Bank Transfer",
      status: "active",
      connected: true,
      icon: <BanknoteIcon className="h-8 w-8 text-blue-500" />,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      status: "inactive",
      connected: false,
      icon: <CreditCard className="h-8 w-8 text-gray-500" />,
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      status: "inactive",
      connected: false,
      icon: <DollarSign className="h-8 w-8 text-gray-500" />,
    },
  ]

  // Sample transactions
  const transactions = [
    {
      id: "txn_001",
      date: "2023-04-20",
      amount: 125.99,
      status: "completed",
      method: "MiniPay",
      customer: "John Smith",
    },
    {
      id: "txn_002",
      date: "2023-04-19",
      amount: 89.5,
      status: "completed",
      method: "Bank Transfer",
      customer: "Sarah Johnson",
    },
    {
      id: "txn_003",
      date: "2023-04-18",
      amount: 245.0,
      status: "processing",
      method: "MiniPay",
      customer: "Michael Chen",
    },
    {
      id: "txn_004",
      date: "2023-04-17",
      amount: 65.25,
      status: "failed",
      method: "Credit Card",
      customer: "Aisha Patel",
    },
    {
      id: "txn_005",
      date: "2023-04-16",
      amount: 178.75,
      status: "completed",
      method: "MiniPay",
      customer: "Robert Garcia",
    },
  ]

  // Sample bank accounts
  const bankAccounts = [
    {
      id: "acc_001",
      name: "Main Business Account",
      bank: "First National Bank",
      number: "****4567",
      default: true,
    },
    {
      id: "acc_002",
      name: "Savings Account",
      bank: "Community Credit Union",
      number: "****7890",
      default: false,
    },
  ]

  const handleConnectPayment = (methodId: string) => {
    setIsConnectingPayment(true)

    // Simulate API call
    setTimeout(() => {
      setIsConnectingPayment(false)

      toast.success("Payment method connected, You can now accept payments with this method.")
    }, 1500)
  }

  const handleDisconnectPayment = (methodId: string) => {
    toast.error("Payment method disconnected")
  }

  const handleAddBankAccount = () => {
    if (!newAccount.name || !newAccount.number || !newAccount.bank) {
      toast.error("Missing information, Please fill in all required fields.")
      return
    }

    setIsAddingAccount(true)

    // Simulate API call
    setTimeout(() => {
      setIsAddingAccount(false)
      setNewAccount({ name: "", number: "", bank: "" })

      toast.success("Bank account added")
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Settings</h1>
            <p className="text-muted-foreground">Manage your payment methods and transaction history.</p>
          </div>
          <Button variant="outline" className="gap-1">
            <Settings className="h-4 w-4" />
            Advanced Settings
          </Button>
        </div>

        <Tabs defaultValue="methods" className="space-y-6">
          <TabsList>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="methods" className="space-y-6">
            <MotionDiv
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2"
            >
              {paymentMethods.map((method) => (
                <MotionDiv key={method.id} variants={itemFade}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {method.icon}
                          <div>
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Status: {method.status === "active" ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={method.connected} disabled={isConnectingPayment} />
                        </div>
                      </div>
                      <div className="mt-4">
                        {method.connected ? (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-green-600">Connected</p>
                            <Button variant="outline" size="sm" onClick={() => handleDisconnectPayment(method.id)}>
                              Disconnect
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={() => handleConnectPayment(method.id)}
                            disabled={isConnectingPayment}
                          >
                            {isConnectingPayment ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>Connect {method.name}</>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </MotionDiv>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure how you receive payments from customers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Step Payment Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require customers to confirm payments in a two-step process for added security.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Payment Capture</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically capture authorized payments after 24 hours.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Save Customer Payment Methods</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to save their payment methods for future purchases.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View and manage your payment transactions.</CardDescription>
                </div>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <MotionUl variants={staggerContainer} initial="hidden" animate="visible">
                      {transactions.map((transaction) => (
                        <MotionLi key={transaction.id} variants={itemFade} className="contents">
                          <TableRow>
                            <TableCell className="font-medium">{transaction.id}</TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>{transaction.customer}</TableCell>
                            <TableCell>{transaction.method}</TableCell>
                            <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          </TableRow>
                        </MotionLi>
                      ))}
                    </MotionUl>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing 5 of 24 transactions</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>Manage your connected bank accounts for payouts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MotionDiv variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                  {bankAccounts.map((account) => (
                    <MotionDiv key={account.id} variants={itemFade}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{account.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {account.bank} • {account.number}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {account.default && (
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  Default
                                </Badge>
                              )}
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              {!account.default && (
                                <Button variant="ghost" size="sm">
                                  Set as Default
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </MotionDiv>
                  ))}
                </MotionDiv>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Bank Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Bank Account</DialogTitle>
                      <DialogDescription>Add a bank account to receive payouts from your sales.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input
                          id="account-name"
                          value={newAccount.name}
                          onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                          placeholder="e.g., Business Checking"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input
                          id="bank-name"
                          value={newAccount.bank}
                          onChange={(e) => setNewAccount({ ...newAccount, bank: e.target.value })}
                          placeholder="e.g., First National Bank"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          value={newAccount.number}
                          onChange={(e) => setNewAccount({ ...newAccount, number: e.target.value })}
                          placeholder="Enter your account number"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewAccount({ name: "", number: "", bank: "" })}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddBankAccount} disabled={isAddingAccount}>
                        {isAddingAccount ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Account"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Complete verification to enable all payment features.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-amber-50 p-4 text-amber-800">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
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
                        className="h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Verification Required</h3>
                      <p className="mt-1 text-sm">
                        Please complete the verification process to enable all payment features and increase your
                        transaction limits.
                      </p>
                      <div className="mt-3">
                        <Button size="sm" variant="outline" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Complete Verification
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
                <CardDescription>Configure when you receive payouts from your sales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payout-schedule">Payout Frequency</Label>
                  <select
                    id="payout-schedule"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="weekly"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="text-sm text-muted-foreground">
                    Choose how often you want to receive payouts to your bank account.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum-payout">Minimum Payout Amount</Label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="minimum-payout"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="50.00"
                      className="max-w-[120px]"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Payouts will only be processed when your balance exceeds this amount.
                  </p>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Next Payout</h3>
                      <p className="text-sm text-muted-foreground">April 28, 2023</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Estimated Amount</h3>
                      <p className="text-sm text-muted-foreground">$1,245.67</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Payout Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>View your past payouts and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bank Account</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>April 14, 2023</TableCell>
                      <TableCell>$1,245.67</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Completed</Badge>
                      </TableCell>
                      <TableCell>Main Business Account (****4567)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>April 7, 2023</TableCell>
                      <TableCell>$987.50</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Completed</Badge>
                      </TableCell>
                      <TableCell>Main Business Account (****4567)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>March 31, 2023</TableCell>
                      <TableCell>$1,567.25</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Completed</Badge>
                      </TableCell>
                      <TableCell>Main Business Account (****4567)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
