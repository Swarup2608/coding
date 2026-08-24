import mongoose from "mongoose";

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase");

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error);

    process.exit(1);
  }
}

export default connectDatabase;