import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Helper to create JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// ===== REGISTER =====
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("Register attempt:", username);

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      console.log("Username already taken:", username);
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, password: hashed });
    const token = createToken(user._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      })
      .status(201)
      .json({ message: "Registered and logged in" });
  } catch (err) {
    console.error("Error in register route:", err);
    res.status(500).json({ error: "Error registering user" });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("No user found with username:", username);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", username);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login error" });
  }
});

// ===== CHECK AUTH =====
router.get("/check-auth", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    console.log("No token found in check-auth");
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("username");
    if (!user) {
      console.log("User not found for token:", decoded.id);
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json({ username: user.username });
  } catch (err) {
    console.error("Invalid token during check-auth:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// ===== LOGOUT =====
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export default router;
