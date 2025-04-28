"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

function formatDate(dateString: string | null) {
  if (!dateString) return "N/A";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}


export default function StartTestingPage() {
  const [playerId, setPlayerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const router = useRouter();


const startTest = async () => {
  if (!playerId.trim()) {
    alert("Please enter a Player ID.");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/testing/start",
      { playerId },
      { withCredentials: true } //Make sure cookies are sent
    );

    const player = res.data.player;
    console.log("Fetched player:", player); 
    setSelectedPlayer(player); //Save the player from the backend
    setShowPopup(true); //Show confirmation popup
  } catch (err: any) {
    console.error("Start test error:", err);
    alert(err?.response?.data?.error || "Player not found or unauthorized.");
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      {/* Back to Dashboard Button */}
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to Dashboard</span>
        </Button>
      </div>

      {!loading ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Start Testing</h1>
          <input
            type="text"
            placeholder="Enter Player ID"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />
          <Button className="w-full bg-blue-600 text-white" onClick={startTest}>
            Start Testing
          </Button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Running Test...</h1>
          <Progress value={progress} className="w-full mb-4" />
          <p className="text-gray-600">Please wait while the test runs...</p>
          <p className="text-black-600">
            Athlete, please move your eyes left and right in front of the device for 30 seconds...
          </p>
        </div>
      )}

      {/* Verification Popup */}
      {showPopup && selectedPlayer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Verify Player Information</h2>
            <p className="text-gray-700 mb-2">Name: {selectedPlayer.name}</p>
            <p className="text-gray-700 mb-2">Date of Birth: {formatDate(selectedPlayer.dob)}</p>
            <p className="text-gray-700 mb-4">Team: {selectedPlayer.organizationName}</p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => {
                  setShowPopup(false);
                  setLoading(true);
                  let progressValue = 0;

                  const interval = setInterval(() => {
                    progressValue += 3.33;
                    setProgress(progressValue);

                    if (progressValue >= 100) {
                      clearInterval(interval);
                      router.push("/testing"); // Redirect after loading
                    }
                  }, 1000);
                }}
                className="bg-green-600 text-white"
              >
                Confirm
              </Button>

              <Button onClick={() => setShowPopup(false)} className="bg-red-600 text-white">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
