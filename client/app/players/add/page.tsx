"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Player } from "../data"

export default function AddPlayerPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    team: "",
    position: "",
    status: "active",
    height: "",
    weight: "",
    email: "",
    phone: "",
    emergency: "",
    medicalNotes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.team || !formData.position) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Get user email from localStorage (from login)
    const userEmail = localStorage.getItem("userEmail") || "demo@cognisight.com"

    // Create a new player object
    const newPlayer: Player = {
      id: `user_${Date.now()}`, // Generate a unique ID
      name: formData.name,
      age: Number.parseInt(formData.age) || 0,
      team: formData.team,
      position: formData.position,
      status: formData.status as "active" | "injured" | "concussion" | "recovery",
      height: formData.height || "Not specified",
      weight: formData.weight || "Not specified",
      medicalHistory: formData.medicalNotes
        ? [
            {
              date: new Date().toISOString().split("T")[0],
              incident: "Initial Medical Notes",
              severity: "mild",
              notes: formData.medicalNotes,
            },
          ]
        : [],
      contactInfo: {
        email: formData.email || "Not provided",
        phone: formData.phone || "Not provided",
        emergency: formData.emergency || "Not provided",
      },
    }

    // Get existing user-added players or initialize empty array
    const existingPlayers = JSON.parse(localStorage.getItem(`players_${userEmail}`) || "[]")

    // Add new player to the array
    const updatedPlayers = [...existingPlayers, newPlayer]

    // Save updated array back to localStorage
    localStorage.setItem(`players_${userEmail}`, JSON.stringify(updatedPlayers))

    // Show success message
    toast({
      title: "Player Added",
      description: `${newPlayer.name} has been added to your database.`,
    })

    // Navigate back to player database
    router.push("/players")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/players">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to Player Database</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Add New Player</h1>
          <div className="w-6" />
        </header>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Player Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter player's full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter player's age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team">Team *</Label>
                    <Input
                      id="team"
                      placeholder="Enter player's team"
                      value={formData.team}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      placeholder="Enter player's position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      placeholder="e.g. 6'2&quot;"
                      value={formData.height}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      placeholder="e.g. 185 lbs"
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select defaultValue="active" onValueChange={(value) => handleSelectChange(value, "status")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select player status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="injured">Injured</SelectItem>
                        <SelectItem value="concussion">Concussion</SelectItem>
                        <SelectItem value="recovery">Recovery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter player's email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter player's phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    placeholder="Name and phone number of emergency contact"
                    value={formData.emergency}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Medical Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Initial Medical Notes</Label>
                  <Textarea
                    id="medicalNotes"
                    placeholder="Enter any initial medical notes or history"
                    className="min-h-[100px]"
                    value={formData.medicalNotes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/players">Cancel</Link>
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Player
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

