import Player from "../models/Players.js";

// Create a new player
export const createPlayer = async (req, res) => {
  const trainerId = req.user._id;
  const {
    name,
    dob,
    age,
    address,
    profilePicUrl,
    height,
    weight,
    email,
    phone,
    emergency,
    organizationId,
    status,
  } = req.body;

  try {
    const player = await Player.create({
      name,
      dob,
      age,
      address,
      profilePicUrl,
      height,
      weight,
      email,
      phone,
      emergency,
      trainerId,
      organizationId,
      status,
    });

    res.status(201).json(player);
  } catch (err) {
    console.error("Create player error:", err);
    res.status(400).json({ error: "Failed to create player" });
  }
};

// Get all players
export const getPlayersByTrainer = async (req, res) => {
  const trainerId = req.user._id;

  try {
    const players = await Player.find({ trainerId }).populate("organizationId");
    res.status(200).json(players);
  } catch (err) {
    console.error("Get players error:", err);
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

// Update a player
export const updatePlayer = async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ message: "Server error during update" });
  }
};
