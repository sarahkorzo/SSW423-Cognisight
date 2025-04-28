import Organization from "../models/Organization.js"

export const createOrganization = async (req, res) => {
  const trainerId = req.user._id
  const { name } = req.body

  try {
    const org = await Organization.create({ name, trainerId })
    res.status(201).json(org)
  } catch (err) {
    console.error("Create org failed:", err)
    res.status(400).json({ error: "Failed to create organization" })
  }
}

export const getOrganizationsByTrainer = async (req, res) => {
  const trainerId = req.user._id

  try {
    const orgs = await Organization.find({ trainerId })
    res.status(200).json(orgs)
  } catch (err) {
    console.error("Get orgs failed:", err)
    res.status(500).json({ error: "Failed to fetch organizations" })
  }
}
