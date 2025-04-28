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
    

#### 2\. Set Up MongoDB

Option 1: MongoDB Atlas (Recommended)

*   Go to MongoDB Atlas

    Create a free account

    Create a free cluster

    Create a Database User (username + password)

    Set Network Access to Allow Access from Anywhere (0.0.0.0/0)

    Click Connect → Connect your application → Copy the connection string.

*   Example connection string:

**mongodb+srv://<username>:<password>@cluster0.mongodb.net/cognisight?retryWrites=true&w=majority**



Option 2: Local MongoDB (Optional)

*   Download MongoDB Community Edition from here

*   Install and run the local Mongo server:

mongod

*   Local connection string:

**mongodb://localhost:27017/cognisight**

#### 3\. Set Up the Backend Server

*   Navigate to the /server folder.

*   Install backend dependencies:

npm install

*   Create a .env file in the /server directory with the following keys:

MONGO_URI=<your-mongo-connection-string>
JWT_SECRET=yourSuperSecretKey
PORT=5000

Example:

MONGO_URI=mongodb+srv://trainer:password@cluster0.mongodb.net/cognisight?retryWrites=true&w=majority
JWT_SECRET=supersecretkey123
PORT=5000

*   Start the backend server:

npm run dev

This will start the Node.js server on http://localhost:5000.

#### 4\. Set Up the Frontend Client

*   Navigate to the /client folder.

    Install frontend dependencies:

npm install

*   Start the Next.js development server:

npm run dev

This will run the React app locally on http://localhost:3000.

#### 5\. Access the App

*   Open your browser and go to:

**http://localhost:3000**

*   Login, create players, run concussion assessments, and manage teams directly from the app.


#### 4\. Testing

*   To test the system, ensure that both the Flask server (from step 1) and the TypeScript React app (from step 2) are running.
*   Use the React frontend to interact with the system and submit data. The Flask server will handle the machine learning processing in the background.

### ML Model

The ML model used in this project analyzes eye-tracking data (patients' X and Y coordinates) to assess concussion likelihood. It is integrated into the Flask backend and provides real-time results based on user inputs from the frontend.

### User Authentication System (Node.js + MongoDB + JWT)

Cognisight includes a secure login and registration system for athletic trainers:

MongoDB is used for storing user accounts.

JWT tokens are used for secure session management.

Protected routes ensure that only authenticated users can access sensitive data (players, tests, organizations).


### Notes

*   The software is currently in development, and some functionality may be experimental.
*   Make sure both the backend (Flask) and frontend (React) are running simultaneously to ensure proper interaction between the two.
*   Make sure both the frontend and backend servers are running simultaneously.
*   Ensure MongoDB server or MongoDB Atlas cluster is available.
*   Create a proper .env file inside /server/ before running the backend.

### Contributing

Feel free to fork the project, create an issue, or submit a pull request with improvements, bug fixes, or new features.
