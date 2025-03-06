"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { playerData, type Player } from "../../data"

export default function AddMedicalRecordPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [medicalRecord, setMedicalRecord] = useState({
    date: new Date().toISOString().split("T")[0],
    incident: "",
    severity: "mild",
    notes: "",
    returnToPlay: "",
    followUpRequired: "no",
    followUpDate: "",
    treatmentPlan: "",
    symptoms: [] as string[],
    attachments: [] as string[],
  })

  // Common concussion symptoms for quick selection
  const commonSymptoms = [
    "Headache",
    "Dizziness",
    "Nausea",
    "Fatigue",
    "Blurred vision",
    "Sensitivity to light",
    "Sensitivity to noise",
    "Balance problems",
    "Difficulty concentrating",
    "Memory problems",
    "Confusion",
    "Drowsiness",
  ]

  // Load player data
  useEffect(() => {
    const loadPlayer = () => {
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
      } else {
        toast({
          title: "Player Not Found",
          description: "Could not find the player record.",
          variant: "destructive",
        })
        router.push("/players")
      }
      setLoading(false)
    }

    loadPlayer()
  }, [params.id, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setMedicalRecord({
      ...medicalRecord,
      [id]: value,
    })
  }

  const handleSelectChange = (value: string, field: string) => {
    setMedicalRecord({
      ...medicalRecord,
      [field]: value,
    })
  }

  const toggleSymptom = (symptom: string) => {
    if (medicalRecord.symptoms.includes(symptom)) {
      setMedicalRecord({
        ...medicalRecord,
        symptoms: medicalRecord.symptoms.filter((s) => s !== symptom),
      })
    } else {
      setMedicalRecord({
        ...medicalRecord,
        symptoms: [...medicalRecord.symptoms, symptom],
      })
    }
  }

  const handleSave = () => {
    if (!player) return

    if (!medicalRecord.incident || !medicalRecord.notes) {
      toast({
        title: "Missing Information",
        description: "Please fill in the incident and notes fields.",
        variant: "destructive",
      })
      return
    }

    // Prepare the new medical record
    const newRecord = {
      date: medicalRecord.date,
      incident: medicalRecord.incident,
      severity: medicalRecord.severity as "mild" | "moderate" | "severe",
      notes:
        medicalRecord.notes +
        (medicalRecord.symptoms.length > 0 ? `\n\nSymptoms: ${medicalRecord.symptoms.join(", ")}` : "") +
        (medicalRecord.treatmentPlan ? `\n\nTreatment Plan: ${medicalRecord.treatmentPlan}` : "") +
        (medicalRecord.followUpRequired === "yes" ? `\n\nFollow-up scheduled for: ${medicalRecord.followUpDate}` : ""),
      returnToPlay: medicalRecord.returnToPlay || undefined,
    }

    // Update player's medical history
    const updatedPlayer = {
      ...player,
      medicalHistory: [...player.medicalHistory, newRecord],
    }

    // Save to localStorage for user-added players
    const isUserAddedPlayer = player.id.startsWith("user_")
    if (isUserAddedPlayer) {
      const userEmail = localStorage.getItem("userEmail")
      if (userEmail) {
        const savedPlayers = localStorage.getItem(`players_${userEmail}`)
        if (savedPlayers) {
          const parsedPlayers = JSON.parse(savedPlayers) as Player[]
          const updatedPlayers = parsedPlayers.map((p) => (p.id === player.id ? updatedPlayer : p))
          localStorage.setItem(`players_${userEmail}`, JSON.stringify(updatedPlayers))
        }
      }
    } else {
      // For demo purposes, just update the local state
      setPlayer(updatedPlayer)
    }

    toast({
      title: "Medical Record Added",
      description: "The medical record has been added to the player's history.",
    })

    // Navigate back to player profile
    router.push(`/players/${player.id}`)
  }

  if (loading || !player) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/players/${player.id}`}>
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to Player Profile</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Add Medical Record</h1>
          <div className="w-10" />
        </header>

        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                New Medical Record for {player.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date of Incident *</Label>
                      <Input id="date" type="date" value={medicalRecord.date} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity *</Label>
                      <Select
                        defaultValue={medicalRecord.severity}
                        onValueChange={(value) => handleSelectChange(value, "severity")}
                      >
                        <SelectTrigger id="severity">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incident">Incident Type/Name *</Label>
                    <Input
                      id="incident"
                      placeholder="e.g. Concussion, Ankle Sprain, Knee Injury"
                      value={medicalRecord.incident}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Symptoms Checklist */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Symptoms</h3>
                  <p className="text-sm text-slate-500">Select all symptoms that apply:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`symptom-${symptom}`}
                          checked={medicalRecord.symptoms.includes(symptom)}
                          onChange={() => toggleSymptom(symptom)}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`symptom-${symptom}`} className="text-sm cursor-pointer">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Detailed Notes *</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter detailed notes about the incident, observations, and initial assessment"
                    className="min-h-[120px]"
                    value={medicalRecord.notes}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Treatment Plan */}
                <div className="space-y-2">
                  <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                  <Textarea
                    id="treatmentPlan"
                    placeholder="Enter the recommended treatment plan"
                    className="min-h-[80px]"
                    value={medicalRecord.treatmentPlan}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Follow-up Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Follow-up Information</h3>
                  <div className="space-y-2">
                    <Label>Follow-up Required?</Label>
                    <RadioGroup
                      defaultValue={medicalRecord.followUpRequired}
                      onValueChange={(value) => handleSelectChange(value, "followUpRequired")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="follow-up-yes" />
                        <Label htmlFor="follow-up-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="follow-up-no" />
                        <Label htmlFor="follow-up-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {medicalRecord.followUpRequired === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="followUpDate">Follow-up Date</Label>
                      <Input
                        id="followUpDate"
                        type="date"
                        value={medicalRecord.followUpDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>

                {/* Return to Play */}
                <div className="space-y-2">
                  <Label htmlFor="returnToPlay">Expected Return to Play Date (if known)</Label>
                  <Input
                    id="returnToPlay"
                    type="date"
                    value={medicalRecord.returnToPlay}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <Button variant="outline" asChild>
                    <Link href={`/players/${player.id}`}>Cancel</Link>
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

