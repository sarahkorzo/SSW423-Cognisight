"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; 
import Link from "next/link";

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
        <header className="grid grid-cols-3 items-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 text-center">Concussion Test Results</h1>
        </header>

        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold">Patient: {patientData.patient_id}</h2>
            <p><strong>Average Saccade Speed:</strong> {patientData.average_saccade_speed}°/s</p>
            <p><strong>Stutter Count:</strong> {patientData.stutter_count}</p>
            <p><strong>Concussion Likelihood:</strong> {patientData.concussion_likelihood}</p>
            <p><strong>Recommendation:</strong> {patientData.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
