"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    emergency: "",
  })

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("atProfileData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setFormData(parsedData)
      setImageUrl(parsedData.imageUrl || null)
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImageUrl(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const dataToSave = { ...formData, imageUrl }
    localStorage.setItem("atProfileData", JSON.stringify(dataToSave))
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    })
  }

  const handleSignOut = () => {
    // Clear any user data or tokens
    localStorage.removeItem("atProfileData")

    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    })

    // Redirect to landing page
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">AT Profile</h1>
          <div className="w-6" />
        </header>

        <Card className="max-w-2xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <label
                  htmlFor="profile-image"
                  className="block w-32 h-32 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer overflow-hidden"
                >
                  {imageUrl ? (
                    <Image src={imageUrl || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                  ) : (
                    <Plus className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                  )}
                </label>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" value={formData.name} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  placeholder="Enter your phone number"
                  type="tel"
                  value={formData.number}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  placeholder="Enter emergency contact"
                  value={formData.emergency}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 pt-4">
              <Button type="button" variant="destructive" className="flex items-center gap-2" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

