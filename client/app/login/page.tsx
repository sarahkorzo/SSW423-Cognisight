"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/AuthContext"
import axios from "axios"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Login form submitted:", formData)

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          username: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (res.status === 200) {
        // Small delay for cookies to register
        setTimeout(async () => {
          await login()
          toast({
            title: "Login Successful",
            description: "Welcome back to Cognisight!",
          })
          router.push("/dashboard")
        }, 300)
      } else {
        throw new Error("Unexpected response")
      }
    } catch (err: any) {
      console.error("Login failed:", err)
    
      const status = err?.response?.status
      const raw = err?.response?.data
      const fallbackMessage = typeof raw === "string" ? raw : "Invalid login. Please try again."
    
      if (status === 400) {
        toast({
          title: "Invalid Login",
          description: fallbackMessage,
          variant: "destructive",
        })
      } else if (status === 404) {
        toast({
          title: "Account Not Found",
          description: "This email is not registered. Would you like to sign up?",
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          ),
        })
      } else if (status === 401) {
        toast({
          title: "Incorrect Credentials",
          description: "The password or email you entered is incorrect.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login Failed",
          description: fallbackMessage,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-600">Log in to your Cognisight account</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-6">
            Log In
          </Button>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
