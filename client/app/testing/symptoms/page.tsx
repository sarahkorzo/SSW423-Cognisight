"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { Button } from "@/components/ui/button"; // Assuming you're using a UI library
import { Switch } from "@/components/ui/switch"; // If you're using a Switch component for toggles
import { Dialog } from "@/components/ui/dialog"; // Assuming you have a Dialog component
import { DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"; // Dialog content and footer components

type Symptoms = {
  headache: boolean;
  nausea: boolean;
  irritability: boolean;
  lightSensitivity: boolean;
  disorientation: boolean;
  blackout: boolean;
};

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptoms>({
    headache: false,
    nausea: false,
    irritability: false,
    lightSensitivity: false,
    disorientation: false,
    blackout: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state for confirmation
  const router = useRouter(); // Initialize the useRouter hook for navigation

  const handleSwitchChange = (symptom: keyof Symptoms) => {
    setSymptoms((prev) => ({
      ...prev,
      [symptom]: !prev[symptom], // Toggle the switch value
    }));
  };

  const handleSubmit = () => {
    setIsDialogOpen(true); // Show the confirmation dialog
  };

  const handleConfirm = () => {
    // Here you can store the data or make an API request to store in the profile
    console.log("Symptoms selected:", symptoms);
    setIsDialogOpen(false); // Close the dialog
    alert("Symptoms have been saved!"); // Optionally show a message
    router.push("/dashboard"); // Navigate to the dashboard page
  };

  const handleCancel = () => {
    setIsDialogOpen(false); // Close the dialog if user cancels
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Select Symptoms</h1>
        </header>

        <div className="space-y-4">
          <div className="flex items-center">
            <label className="mr-4">Headache</label>
            <Switch
              checked={symptoms.headache}
              onCheckedChange={() => handleSwitchChange("headache")}
            />
          </div>
          <div className="flex items-center">
            <label className="mr-4">Nausea</label>
            <Switch
              checked={symptoms.nausea}
              onCheckedChange={() => handleSwitchChange("nausea")}
            />
          </div>
          <div className="flex items-center">
            <label className="mr-4">Irritability</label>
            <Switch
              checked={symptoms.irritability}
              onCheckedChange={() => handleSwitchChange("irritability")}
            />
          </div>
          <div className="flex items-center">
            <label className="mr-4">Light Sensitivity</label>
            <Switch
              checked={symptoms.lightSensitivity}
              onCheckedChange={() => handleSwitchChange("lightSensitivity")}
            />
          </div>
          <div className="flex items-center">
            <label className="mr-4">Disorientation</label>
            <Switch
              checked={symptoms.disorientation}
              onCheckedChange={() => handleSwitchChange("disorientation")}
            />
          </div>
          <div className="flex items-center">
            <label className="mr-4">Blackout</label>
            <Switch
              checked={symptoms.blackout}
              onCheckedChange={() => handleSwitchChange("blackout")}
            />
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            className="bg-blue-700 text-white hover:bg-blue-800"
          >
            Save Results
          </Button>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <h2 className="text-xl font-bold">Confirm Results</h2>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              Are you sure you want to save the selected symptoms?
            </p>
            <DialogFooter>
              <Button onClick={handleCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="bg-blue-700 text-white hover:bg-blue-800 ml-4">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
