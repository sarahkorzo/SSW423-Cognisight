"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; 
import Link from "next/link";
import { ArrowLeft } from "lucide-react"; // Importing the ArrowLeft icon

export default function TestingPage() {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/run_ml');
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }
        const data = await response.json();
        setPatientData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          {/* Back button */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 text-center">Concussion Test Results</h1>
          <div className="w-6" />
        </header>

        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold">Patient: {patientData.patient_id}</h2>
            <p><strong>Average Saccade Speed:</strong> {patientData.average_saccade_speed}°/s</p>
            <p><strong>Stutter Count:</strong> {patientData.stutter_count}</p>
            <p><strong>Concussion Likelihood:</strong> {patientData.concussion_likelihood}</p>
            <p><strong>Recommendation:</strong> {patientData.recommendation}</p>
          </div>

          {/* Display the scatter plot image */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Scatter Plot</h3>
            <img src="/scatter_plot.png" alt="Scatter Plot" className="max-w-full h-auto mt-4" />
          </div>

          {/* Button to go to symtoms page */}
          <div className="mt-8">
          <Link href="/testing/symptoms" passHref>
            <Button className="bg-blue-700 text-white hover:bg-blue-800">
              Continue to Symptoms
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
