import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import testingRoutes from "./routes/testingRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/testing", testingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
