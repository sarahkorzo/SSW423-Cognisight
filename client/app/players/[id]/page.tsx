"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, FileText, AlertCircle, Edit, Trash, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { playerData, type Player } from "../data"

export default function PlayerProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [player, setPlayer] = useState<Player | null>(null)
  const [editedPlayer, setEditedPlayer] = useState<Player | null>(null)

  // Load player data
  useEffect(() => {
    // First check pre-defined players
    let foundPlayer = playerData.find((p) => p.id === params.id)

    // If not found, check user-added players
    if (!foundPlayer) {
      const userEmail = localStorage.getItem("userEmail")
      if (userEmail) {
        const savedPlayers = localStorage.getItem(`players_${userEmail}`)
        if (savedPlayers) {
          const parsedPlayers = JSON.parse(savedPlayers) as Player[]
          foundPlayer = parsedPlayers.find((p) => p.id === params.id)
        }
      }
    }

    if (foundPlayer) {
      setPlayer(foundPlayer)
      setEditedPlayer(JSON.parse(JSON.stringify(foundPlayer))) // Deep copy
    } else {
      router.push("/players")
    }
  }, [params.id, router])

  if (!player || !editedPlayer) {
    return null // Loading state
  }

  const isUserAddedPlayer = player.id.startsWith("user_")

  const statusConfig = {
    active: { label: "Active", variant: "outline" as const, color: "text-green-600" },
    injured: { label: "Injured", variant: "destructive" as const, color: "text-red-600" },
    concussion: { label: "Concussion", variant: "destructive" as const, color: "text-red-600" },
    recovery: { label: "Recovery", variant: "secondary" as const, color: "text-amber-600" },
  }

  const statusInfo = statusConfig[player.status]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target

    if (id.includes(".")) {
      // Handle nested properties like contactInfo.email
      const [parent, child] = id.split(".")
      setEditedPlayer({
        ...editedPlayer,
        [parent]: {
          ...editedPlayer[parent as keyof Player],
          [child]: value,
        },
      })
    } else {
      setEditedPlayer({
        ...editedPlayer,
        [id]: value,
      })
    }
  }

  const handleSelectChange = (value: string, field: string) => {
    setEditedPlayer({
      ...editedPlayer,
      [field]: value,
    })
  }

  const saveChanges = (skipToast = false) => {
    if (isUserAddedPlayer) {
      const userEmail = localStorage.getItem("userEmail")
      if (userEmail) {
        const savedPlayers = localStorage.getItem(`players_${userEmail}`)
        if (savedPlayers) {
          const parsedPlayers = JSON.parse(savedPlayers) as Player[]
          const updatedPlayers = parsedPlayers.map((p) => (p.id === editedPlayer.id ? editedPlayer : p))

          localStorage.setItem(`players_${userEmail}`, JSON.stringify(updatedPlayers))
          setPlayer(editedPlayer)
          setIsEditing(false)

          if (!skipToast) {
            toast({
              title: "Changes Saved",
              description: "Player information has been updated successfully.",
            })
          }
        }
      }
    } else {
      // For demo purposes, just update the local state
      setPlayer(editedPlayer)
      setIsEditing(false)

      if (!skipToast) {
        toast({
          title: "Changes Saved",
          description: "Player information has been updated successfully.",
        })
      }
    }
  }

  const deletePlayer = () => {
    if (isUserAddedPlayer) {
      const userEmail = localStorage.getItem("userEmail")
      if (userEmail) {
        const savedPlayers = localStorage.getItem(`players_${userEmail}`)
        if (savedPlayers) {
          const parsedPlayers = JSON.parse(savedPlayers) as Player[]
          const updatedPlayers = parsedPlayers.filter((p) => p.id !== player.id)

          localStorage.setItem(`players_${userEmail}`, JSON.stringify(updatedPlayers))

          toast({
            title: "Player Deleted",
            description: "The player has been removed from your database.",
          })

          router.push("/players")
        }
      }
    } else {
      toast({
        title: "Cannot Delete",
        description: "Demo players cannot be deleted.",
        variant: "destructive",
      })
    }
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
          <h1 className="text-3xl font-bold text-slate-800">Player Profile</h1>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedPlayer(JSON.parse(JSON.stringify(player)))
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => saveChanges()} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {player.name} from your player database. This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deletePlayer}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Player Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedPlayer.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold mb-2"
                    />
                  ) : (
                    <CardTitle className="text-2xl">{player.name}</CardTitle>
                  )}
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="team">Team</Label>
                        <Input id="team" value={editedPlayer.team} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="trainerName">Trainer Name</Label>
                        <Input id="trainerName" value={editedPlayer.trainerName} onChange={handleInputChange} />
                      </div>
                    </div>
                  ) : (
                    <CardDescription className="text-lg">
                      {player.team} • {player.trainerName}
                    </CardDescription>
                  )}
                </div>
                {isEditing ? (
                  <div className="min-w-[120px]">
                    <Label>Status</Label>
                    <Select
                      defaultValue={editedPlayer.status}
                      onValueChange={(value) => handleSelectChange(value, "status")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="injured">Injured</SelectItem>
                        <SelectItem value="concussion">Concussion</SelectItem>
                        <SelectItem value="recovery">Recovery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
                    {statusInfo.label}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
              <div>
                  <p className="text-sm text-slate-500">Date of Birth</p>
                  {isEditing ? (
                    <Input id="dob" type="number" value={editedPlayer.dob} onChange={handleInputChange} />
                  ) : (
                    <p className="font-medium">{player.dob}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Age</p>
                  {isEditing ? (
                    <Input id="age" type="number" value={editedPlayer.age} onChange={handleInputChange} />
                  ) : (
                    <p className="font-medium">{player.age} years</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Height</p>
                  {isEditing ? (
                    <Input id="height" value={editedPlayer.height} onChange={handleInputChange} />
                  ) : (
                    <p className="font-medium">{player.height}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Weight</p>
                  {isEditing ? (
                    <Input id="weight" value={editedPlayer.weight} onChange={handleInputChange} />
                  ) : (
                    <p className="font-medium">{player.weight}</p>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    {isEditing ? (
                      <Input
                        id="contactInfo.email"
                        type="email"
                        value={editedPlayer.contactInfo.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="font-medium">{player.contactInfo.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    {isEditing ? (
                      <Input
                        id="contactInfo.phone"
                        value={editedPlayer.contactInfo.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="font-medium">{player.contactInfo.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Emergency Contact</p>
                  {isEditing ? (
                    <Input
                      id="contactInfo.emergency"
                      value={editedPlayer.contactInfo.emergency}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-medium">{player.contactInfo.emergency}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Medical History</CardTitle>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <Link href={`/players/${player.id}/add-record`}>
                    <Plus className="h-4 w-4" />
                    Add Record
                  </Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {player.medicalHistory.length > 0 ? (
                <div className="space-y-6">
                  {player.medicalHistory.map((record, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-600">{record.date}</span>
                        </div>
                        <SeverityBadge severity={record.severity} />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{record.incident}</h4>
                      <p className="text-slate-700 mb-3">{record.notes}</p>
                      {record.returnToPlay && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span className="text-sm font-medium">Return to Play: {record.returnToPlay}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No medical history recorded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Status Card */}
          {player.status === "concussion" && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  Concussion Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-2">
                  This player is currently under concussion protocol and should not participate in any physical
                  activities.
                </p>
                <p className="text-red-600 font-medium">
                  Next evaluation scheduled:{" "}
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </CardContent>
            </Card>
          )}

          {player.status === "recovery" && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                  Recovery Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 mb-2">
                  This player is in recovery phase. Limited non-contact activities permitted under supervision.
                </p>
                <p className="text-amber-600 font-medium">
                  Next evaluation scheduled:{" "}
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function SeverityBadge({ severity }: { severity: "mild" | "moderate" | "severe" }) {
  const severityConfig = {
    mild: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    moderate: { color: "bg-orange-100 text-orange-800 border-orange-200" },
    severe: { color: "bg-red-100 text-red-800 border-red-200" },
  }

  const config = severityConfig[severity]

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${config.color}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  )
}

