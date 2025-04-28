import express from "express"
import { createOrganization, getOrganizationsByTrainer } from "../controllers/organizationController.js"
import requireAuth from "../middleware/requireAuth.js"

const router = express.Router()

router.use(requireAuth) // only logged-in trainers can access

router.post("/", createOrganization)
router.get("/", getOrganizationsByTrainer)

export default router
