"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MotionDiv, fadeIn, slideUp } from "@/components/animations/motion";
import { useAccount } from "wagmi";
import { useAPI } from "@/contexts/jes-context";

export default function SignupPage() {
  const { registerUser } = useAPI();
  const { address } = useAccount();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(address);
      const payload = {
        wallet_address: address,
        user_name: formData.name,
        email: formData.email,
        phone_number: formData.phoneNumber,
        house_address: formData.address,
      }
      console.log(payload);
      const response = await registerUser(payload);
      console.log(response);
      setIsLoading(false);
      if (response && response.token) {
        toast.success(
          "Account created!, Your account has been created successfully."
        );
      }
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
      });
      router.push("/dashboard");
    } catch (error) {
      toast(
        "Error, There was an error creating your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <MotionDiv
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">JES-Storefront</span>
          </div>
          <h1 className="text-2xl font-bold">Create your merchant account</h1>
          <p className="mt-2 text-muted-foreground">
            Start accepting payments with JES-Storefront today
          </p>
        </MotionDiv>

        <MotionDiv variants={slideUp} initial="hidden" animate="visible">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">User Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Smith"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="+234 9065729637"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="pl-10"
                      />
                      <div className="absolute left-3 -top-1 flex h-full items-center text-muted-foreground">
                        <Phone className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Include country code for international numbers
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street"
                    required
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Log in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </MotionDiv>
      </div>
    </div>
  );
}
