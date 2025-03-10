import os
import pandas as pd
import numpy as np
import random
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Allow cross-origin requests only from the Next.js app
CORS(app, origins=["http://localhost:3000"])  # Replace with your frontend URL if different


# Function to load eye movement data
def load_data():
    input_dir = "data/dataset_normalised_5mins"
    data_frames = {}

    for root, _, files in os.walk(input_dir):
        for file in files:
            if file.endswith(".csv") and "_READ" in file:
                file_path = os.path.join(root, file)
                person_id = file.replace(".csv", "")
                data_frames[person_id] = pd.read_csv(file_path)

    return data_frames

# Concussion Likelihood Calculation (from your ML algorithm)
def concussion_likelihood(speed, stutter_count):
    likelihood = (stutter_count * 0.6) + ((50 - speed) * 0.4)
    return likelihood > 5

# Simulate Patient Test Using the Dataset
def simulate_patient():
    data_frames = load_data()

    # Pick a random patient
    if not data_frames:
        return {"error": "No data found in dataset folder."}

    patient_id = random.choice(list(data_frames.keys()))
    patient_data = data_frames[patient_id]

    # Process patient data (example calculation)
    avg_speed = np.random.normal(349.31, 97.90)  # Simulated speed
    stutter_count = np.random.poisson(6)  # Simulated stutter count

    # Run ML Algorithm
    likelihood = concussion_likelihood(avg_speed, stutter_count)

    return {
        "patient_id": patient_id,
        "average_saccade_speed": round(avg_speed, 2),
        "stutter_count": round(stutter_count, 2),
        "concussion_likelihood": "Likely" if likelihood else "Unlikely",
        "recommendation": "⚠️ Further evaluation needed" if likelihood else "✅ No significant risk detected."
    }

# API Endpoint for ML Processing
@app.route("/run_ml", methods=["GET"])
def run_ml():
    return jsonify(simulate_patient())

if __name__ == "__main__":
    app.run(debug=True)