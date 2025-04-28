import express from "express";
import { startTest } from "../controllers/testingController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Protect all testing routes
router.use(requireAuth);

// Start a test
router.post("/start", startTest);

export default router;
