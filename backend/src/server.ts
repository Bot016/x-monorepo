import express from "express";
import { env, allowedOrigins } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).send("OK");
  } catch {
    res.status(503).send("Internal Server Error. DB unreachable");
  }
});

const server = app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
