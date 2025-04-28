"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createPlayer, fetchOrganizations } from "@/lib/api"; //Only real API calls

export default function AddPlayerPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    team: "", // Will store organizationId
    status: "active",
    height: "",
    weight: "",
    email: "",
    phone: "",
    emergency: "",
    medicalNotes: "",
  });

  const [organizations, setOrganizations] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        const orgs = await fetchOrganizations();
        setOrganizations(orgs);
      } catch (err) {
        console.error("Failed to load organizations", err);
      }
    };

    loadOrgs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!formData.name || !formData.team) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      await createPlayer({
        name: formData.name,
        dob: formData.dob,
        age: formData.age,
        profilePicUrl: "https://example.com/default-player.png",
        address: { street: "Unknown", city: "Unknown", zip: "Unknown" },
        height: formData.height,
        weight: formData.weight,
        email: formData.email,
        phone: formData.phone,
        emergency: formData.emergency,
        organizationId: formData.team,
        status: formData.status,
      });
      
  
      toast({
        title: "Player Added!",
        description: `${formData.name} has been added to your database.`,
      });
  
      router.push("/players");
    } catch (error) {
      console.error("Failed to add player", error);
      toast({
        title: "Failed to Add Player",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  

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
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      placeholder="mm-dd-yyyy"
                      value={formData.dob}
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
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      placeholder="e.g. 6 ft 2 in"
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


                  {/* Team Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="team">Team *</Label>
                    <Select value={formData.team} onValueChange={(value) => handleSelectChange(value, "team")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org._id} value={org._id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange(value, "status")}>
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

              {/* Contact Info and Medical Info */}
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
                    placeholder="Emergency contact name and number"
                    value={formData.emergency}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Medical Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Initial Medical Notes</Label>
                  <Textarea
                    id="medicalNotes"
                    placeholder="Enter any initial medical notes"
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
  );
}
