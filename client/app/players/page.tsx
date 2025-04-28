"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchPlayers, fetchOrganizations } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

//Define Types for strong typing
type PopulatedOrganization = {
  _id: string;
  name: string;
};

type PlayerType = {
  _id: string;
  name: string;
  profilePicUrl: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  organizationId: string | PopulatedOrganization;
  status: "active" | "injured" | "concussion" | "recovery";
};

export default function PlayerDatabasePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [organizations, setOrganizations] = useState<PopulatedOrganization[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pls = await fetchPlayers();
        const orgs = await fetchOrganizations();
        setPlayers(pls);
        setOrganizations(orgs);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    if (!loading && user) {
      loadData();
    }
  }, [loading, user]);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.address?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (organizations.find((org) => org._id === (typeof player.organizationId === "string" ? player.organizationId : player.organizationId._id))?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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
          <div className="flex flex-col items-end space-y-2">

            <Button className="bg-blue-700 hover:bg-blue-800 text-white hidden md:flex items-center gap-2" asChild>
              <Link href="/players/add">
                <Plus className="h-4 w-4" />
                Add New Player
              </Link>
            </Button>

            <Button className="bg-green-700 hover:bg-green-800 text-white hidden md:flex items-center gap-2" asChild>
              <Link href="/organizations/add">
                <Plus className="h-4 w-4" />
                Add New Team
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
              placeholder="Search players by name, city, or team..."
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
                <Card key={player._id} className="p-4 hover:bg-slate-100 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{player.name}</h3>
                      <p className="text-slate-400 text-sm">ID: {player._id}</p>
                      <p className="text-slate-500">
                        {organizations.find((org) => org._id === (typeof player.organizationId === "string" ? player.organizationId : player.organizationId._id))?.name || "Unknown"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={player.status} />
                      <Link href={`/players/${player._id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/players/edit/${player._id}`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                    </div>
                  </div>
                </Card>


              ))
            ) : (
              <EmptyState message={searchQuery ? "No players match your search" : "No players found"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: "active" | "injured" | "concussion" | "recovery" }) {
  const statusConfig = {
    active: { label: "Active", className: "bg-green-500 text-white" },
    injured: { label: "Injured", className: "bg-red-500 text-white" },
    concussion: { label: "Concussion", className: "bg-red-500 text-white" },
    recovery: { label: "Recovery", className: "bg-yellow-500 text-white" },
  };

  const config = statusConfig[status] || statusConfig.active;

  return <Badge className={config.className}>{config.label}</Badge>;
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <User className="h-12 w-12 mx-auto text-slate-300 mb-4" />
      <p className="text-slate-500">{message}</p>
    </div>
  );
}
