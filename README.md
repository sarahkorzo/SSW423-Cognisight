# Concussion Detection and Athletic Training Software

This is a machine learning-based concussion detection and athletic training software. It uses a Tobii eye-tracking dataset from Kaggle containing patients' X and Y coordinates for concussion detection. The system provides tools for athletes and trainers to monitor and assess concussion likelihood based on eye movement data.

## Requirements

*   **Python** (for the Flask server)
*   **Node.js** (for running the React app)
*   **npm** (for installing dependencies)

### Steps to Set Up and Run

#### 1\. Set Up Flask Server

*   Navigate to the backend folder where the `server.py` file is located.
    
*   Run the following command to start the Flask server:
    
    bash
    
    CopyEdit
    
    `python server.py`
    
    This will start the Flask server, which is responsible for handling API requests related to the concussion detection model.
    

#### 2\. Run Frontend Locally

*   In the project root directory, navigate to the `client` folder (or wherever the TypeScript React app is located).
    
*   Install the required dependencies:
    
    bash
    
    CopyEdit
    
    `npm install`
    
*   After the dependencies are installed, run the development server:
    
    bash
    
    CopyEdit
    
    `npm run dev`
    
    This will start the React app locally on `http://localhost:3000`.

    
#### 3\. User Authentication Backend (Node.js + MongoDB + JWT)

This project includes a secure login and registration system for trainers using MongoDB and JSON Web Tokens (JWT). This enables protected access to sensitive features like player directories and concussion results.

*   Install Backend Dependencies
    Navigate to the `/server` folder.
    Run the following command to install required packages:

    `npm install`

*   Create the `.env` File

    In the `/server` directory, create a `.env` file with the following keys:

    ```
    MONGO_URL=mongodb+srv://<your-username>:<your-password>@<your-cluster>.mongodb.net
    MONGO_DB=cognisight
    JWT_SECRET=your-super-secret-key
    ```

    You can use the provided `.env.example` file as a reference.

*   Run the Backend Server

    In the `/server` folder, run the following command to start the backend:

    `npm run dev`

    This will start the Node.js server on `http://localhost:5000`.

These setup steps enable secure login and sign-up functionality using MongoDB and JWT, which will protect access to future features like player data and concussion assessments.


#### 4\. Testing

*   To test the system, ensure that both the Flask server (from step 1) and the TypeScript React app (from step 2) are running.
*   Use the React frontend to interact with the system and submit data. The Flask server will handle the machine learning processing in the background.

### ML Model

The ML model used in this project analyzes eye-tracking data (patients' X and Y coordinates) to assess concussion likelihood. It is integrated into the Flask backend and provides real-time results based on user inputs from the frontend.


### Notes

*   The software is currently in development, and some functionality may be experimental.
*   Make sure both the backend (Flask) and frontend (React) are running simultaneously to ensure proper interaction between the two.

### Contributing

Feel free to fork the project, create an issue, or submit a pull request with improvements, bug fixes, or new features.
