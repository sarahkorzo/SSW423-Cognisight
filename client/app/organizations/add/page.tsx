"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createOrganization } from "@/lib/api";

export default function AddOrganizationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [orgName, setOrgName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!orgName.trim()) {
      toast({
        title: "Organization Name Required",
        description: "Please enter a name for your team.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOrganization({ name: orgName });

      toast({
        title: "Organization Created!",
        description: `${orgName} has been added.`,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create organization", err);
      toast({
        title: "Failed to Create Organization",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Add New Organization</h1>
          <div className="w-6" />
        </header>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  placeholder="Enter team/organization name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Organization
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
