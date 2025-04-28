import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  profilePicUrl: String,
  address: {
    street: String,
    city: String,
    zip: String,
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  age: { type: Number },
  height: String,
  weight: String,
  email: String,
  phone: String,
  emergency: {
    contactName: { type: String },
    contactPhone: { type: String },
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "injured", "concussion", "recovery"],
    default: "active",
  },
  medicalNotes: String,
});


export default mongoose.model("Player", PlayerSchema);
