import mongoose from "mongoose"

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Organization", OrganizationSchema)
