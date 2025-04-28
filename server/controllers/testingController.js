import Player from "../models/Players.js";

export const startTest = async (req, res) => {
  const { playerId } = req.body;
  const trainerId = req.user._id; // from token!

  try {
    const player = await Player.findOne({
      _id: playerId,
      trainerId: trainerId,
    }).populate("organizationId");

    if (!player) {
      return res.status(404).json({ error: "Player not found or unauthorized." });
    }

    res.json({
      player: {
        _id: player._id,
        name: player.name,
        dob: player.dob ? player.dob.toISOString().split('T')[0] : null,
        organizationName: player.organizationId?.name || "Unknown",
      },
    });
  } catch (err) {
    console.error("Start test error:", err);
    res.status(500).json({ error: "Server error starting test." });
  }
};
