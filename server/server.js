import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser" 
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()
const app = express()


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

//Connect to MongoDB
connectDB()

//Routes
app.use("/api/users", userRoutes)

//Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
