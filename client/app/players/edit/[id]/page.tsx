"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { fetchPlayers, updatePlayer, fetchOrganizations } from "@/lib/api";

export default function EditPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const playerId = params.id;

  const [playerData, setPlayerData] = useState<any>(null);
  const [organizations, setOrganizations] = useState<{ _id: string; name: string }[]>([]);
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const players = await fetchPlayers();
        const player = players.find((p: any) => p._id === playerId);
        if (player) {
          setPlayerData({
            ...player,
            dob: player.dob ? player.dob.split('T')[0] : '',
            organizationId: typeof player.organizationId === "object" ? player.organizationId._id : player.organizationId,
          });

          setEmergencyContactName(player.emergency?.contactName || "");
          setEmergencyContactPhone(player.emergency?.contactPhone || "");
        } else {
          toast({ title: "Player not found", variant: "destructive" });
          router.push("/players");
        }

        const orgs = await fetchOrganizations();
        setOrganizations(orgs);
      } catch (err) {
        console.error("Failed to fetch player", err);
      }
    };

    loadData();
  }, [playerId, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPlayerData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setPlayerData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { name, dob, age, height, weight, email, phone, status, organizationId, medicalNotes } = playerData;

      await updatePlayer(playerId, {
        name,
        dob,
        age,
        height,
        weight,
        email,
        phone,
        emergency: {
          contactName: emergencyContactName,
          contactPhone: emergencyContactPhone,
        },
        status,
        organizationId,
        medicalNotes,
      });

      toast({ title: "Player Updated!" });
      router.push("/players");
    } catch (err) {
      console.error("Failed to update player", err);
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  if (!playerData) return <div>Loading...</div>;

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
          <h1 className="text-3xl font-bold text-slate-800">Edit Player</h1>
          <div className="w-6" />
        </header>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Player Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBlock id="name" label="Name" value={playerData.name} onChange={handleChange} required />
                <InputBlock id="dob" label="Date of Birth" value={playerData.dob} onChange={handleChange} required type="date" />
                <InputBlock id="age" label="Age" value={playerData.age} onChange={handleChange} required />
                <InputBlock id="height" label="Height" value={playerData.height} onChange={handleChange} />
                <InputBlock id="weight" label="Weight" value={playerData.weight} onChange={handleChange} />
                <InputBlock id="email" label="Email" value={playerData.email} onChange={handleChange} />
                <InputBlock id="phone" label="Phone" value={playerData.phone} onChange={handleChange} />

                {/* Emergency Contact Name */}
                <InputBlock id="emergencyContactName" label="Emergency Contact Name" value={emergencyContactName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmergencyContactName(e.target.value)} />
                <InputBlock id="emergencyContactPhone" label="Emergency Contact Phone" value={emergencyContactPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmergencyContactPhone(e.target.value)} />

                {/* Status Dropdown */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={playerData.status} onValueChange={(value) => handleSelectChange(value, "status")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="injured">Injured</SelectItem>
                      <SelectItem value="concussion">Concussion</SelectItem>
                      <SelectItem value="recovery">Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Dropdown */}
                <div className="space-y-2">
                  <Label>Team</Label>
                  <Select
                    value={playerData.organizationId}
                    onValueChange={(value) => handleSelectChange(value, "organizationId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
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
              </div>

              {/* Medical Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Medical Notes</h3>
                <Textarea
                  id="medicalNotes"
                  value={playerData.medicalNotes || ""}
                  onChange={handleChange}
                  placeholder="Enter medical notes"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/players">Cancel</Link>
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InputBlock({ id, label, value, onChange, required = false, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        onChange={onChange}
        required={required}
        type={type}
      />
    </div>
  );
}
