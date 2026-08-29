import {Queue} from "bullmq";
import { Redis as IORedis } from "ioredis";

const connection = new IORedis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  }
);

connection.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export const submissionQueue = new Queue("submission", {
  connection,
});