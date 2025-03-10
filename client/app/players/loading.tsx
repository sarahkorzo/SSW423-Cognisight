import React, { useEffect, useState } from 'react';

const Loading: React.FC = () => {
  // States to store the fetched data
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the Flask server
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/run_ml');
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }
        const data = await response.json();
        setPatientData(data); // Store the data in the state
      } catch (err: any) {
        setError(err.message); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchData();
  }, []); // Empty dependency array to run this effect once on component mount

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if something went wrong
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If data is available, display it
  return (
    <div>
      <h2>Concussion Test Results</h2>
      <p><strong>Patient ID:</strong> {patientData.patient_id}</p>
      <p><strong>Average Saccade Speed:</strong> {patientData.average_saccade_speed}°/s</p>
      <p><strong>Stutter Count:</strong> {patientData.stutter_count}</p>
      <p><strong>Concussion Likelihood:</strong> {patientData.concussion_likelihood}</p>
      <p><strong>Recommendation:</strong> {patientData.recommendation}</p>
    </div>
  );
};

export default Loading;
