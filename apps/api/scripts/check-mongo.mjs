import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("[check-mongo] MONGODB_URI is not set in this environment.");
  process.exit(0);
}

console.log("[check-mongo] Attempting connection...");

const start = Date.now();

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });

  console.log(`[check-mongo] SUCCESS - connected in ${Date.now() - start}ms`);

  await mongoose.disconnect();
} catch (error) {
  console.error(`[check-mongo] FAILED after ${Date.now() - start}ms`);
  console.error(error);
}

process.exit(0);
