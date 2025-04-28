import express from "express"
import { createPlayer, getPlayersByTrainer, updatePlayer } from "../controllers/playerController.js"
import requireAuth from "../middleware/requireAuth.js"

const router = express.Router()

router.use(requireAuth)

router.post("/", createPlayer) // POST /api/players
router.get("/", getPlayersByTrainer) // GET /api/players
router.put("/:id", updatePlayer); // PUT /api/players/:id

export default router
