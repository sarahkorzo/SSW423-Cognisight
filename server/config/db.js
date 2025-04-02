import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const fullURI = `${process.env.MONGO_URL}/${process.env.MONGO_DB}`;
    await mongoose.connect(fullURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
