import "dotenv/config";

import {
  Worker,
} from "bullmq";

import { Redis as IORedis } from "ioredis";

import {
  connectDatabase,
} from "./config/database.js";

import {
  judgeSubmission,
} from "./judge.js";

const connection =
  new IORedis(
    process.env.REDIS_URL ||
      "redis://localhost:6379",
    {
      maxRetriesPerRequest: null,
    }
  );

async function startWorker() {
  await connectDatabase();

  const worker =
    new Worker(
      "submission",
      async (job) => {
        console.log(
          `Judging submission ${job.data.submissionId}`
        );

        await judgeSubmission(
          job.data.submissionId
        );

        console.log(
          `Finished submission ${job.data.submissionId}`
        );
      },
      {
        connection,

        concurrency: 2,
      }
    );

  worker.on(
    "completed",
    (job) => {
      console.log(
        `Job ${job.id} completed`
      );
    }
  );

  worker.on(
    "failed",
    (job, error) => {
      console.error(
        `Job ${job?.id} failed`,
        error
      );
    }
  );

  console.log(
    "Judge worker is running"
  );
}

startWorker();