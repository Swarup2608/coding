import mongoose from "mongoose";

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  if (mongoose.connection.readyState !== 0) {
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error);

    throw error;
  }
}

export default connectDatabase;