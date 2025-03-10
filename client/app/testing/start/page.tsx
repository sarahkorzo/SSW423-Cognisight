"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function StartTestingPage() {
  const [playerId, setPlayerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const startTest = () => {
    if (!playerId.trim()) {
      alert("Please enter a Player ID.");
      return;
    }

    setLoading(true);
    let progressValue = 0;

    // Simulate progress bar
    const interval = setInterval(() => {
      progressValue += 3.33; // 30s total (3.33 * 30 = ~100%)
      setProgress(progressValue);

      if (progressValue >= 100) {
        clearInterval(interval);
        router.push("/testing"); // Navigate to `page.tsx` after loading
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
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
          <p className="text-black-600">Athlete please move your eyes left and right in front of the device for 30 seconds...</p>
        </div>
      )}
    </div>
  );
}
