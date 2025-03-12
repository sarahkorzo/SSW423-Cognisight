"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { playerData, type Player } from "./data"

export default function PlayerDatabasePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [allPlayers, setAllPlayers] = useState<Player[]>([...playerData])

  // Load user-added players from localStorage on component mount
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (userEmail) {
      const savedPlayers = localStorage.getItem(`players_${userEmail}`)
      if (savedPlayers) {
        const parsedPlayers = JSON.parse(savedPlayers) as Player[]
        // Combine pre-existing players with user-added players
        setAllPlayers([...playerData, ...parsedPlayers])
      }
    }
  }, [])

  // Filter players based on search query
  const filteredPlayers = allPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.trainerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="grid grid-cols-3 items-center mb-12">
          <div className="flex justify-start">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-6 w-6" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 text-center">Player Database</h1>
          <div className="flex justify-end">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white hidden md:flex items-center gap-2" asChild>
              <Link href="/players/add">
                <Plus className="h-4 w-4" />
                Add New Player
              </Link>
            </Button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search players by name, team, or trainer name..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add Player Button (Mobile) */}
          <div className="mb-6 md:hidden">
            <Button
              className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white"
              asChild
            >
              <Link href="/players/add">
                <Plus className="h-5 w-5" />
                Add New Player
              </Link>
            </Button>
          </div>

          {/* Player List */}
          <div className="space-y-4">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <Link key={player.id} href={`/players/${player.id}`}>
                  <Card className="p-4 hover:bg-slate-100 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">{player.name}</h3>
                        <p className="text-slate-500">
                          {player.team} • {player.trainerName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={player.status} />
                        <div className="text-right">
                          <p className="text-sm text-slate-500">DOB</p>
                          <p className="font-medium">{player.dob}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <EmptyState message={searchQuery ? "No players match your search" : "No players found"} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: "active" | "injured" | "concussion" | "recovery" }) {
  const statusConfig = {
    active: { label: "Active", variant: "outline" as const },
    injured: { label: "Injured", variant: "destructive" as const },
    concussion: { label: "Concussion", variant: "destructive" as const },
    recovery: { label: "Recovery", variant: "secondary" as const },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <User className="h-12 w-12 mx-auto text-slate-300 mb-4" />
      <p className="text-slate-500">{message}</p>
    </div>
  )
}

