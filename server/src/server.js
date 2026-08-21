import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env, assertEnv, isEmailConfigured, isCloudinaryConfigured } from "./config/env.js";

const start = async () => {
  assertEnv();
  await connectDB();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port} (${env.nodeEnv})`);
    console.log(`[server] allowed origins: ${env.clientOrigins.join(", ")}`);
    if (!isEmailConfigured()) console.warn("[server] SMTP not configured - contact emails will fail");
    if (!isCloudinaryConfigured()) console.warn("[server] Cloudinary not configured - uploads disabled");
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `[server] port ${env.port} is already in use - another dev server is still running.\n` +
          `         Windows: netstat -ano | findstr :${env.port}   then  taskkill /PID <pid> /F`
      );
      process.exit(1);
    }
    throw error;
  });

  const shutdown = (signal) => () => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown("SIGINT"));
  process.on("SIGTERM", shutdown("SIGTERM"));
};

/** Turn the common Atlas failures into something actionable. */
const hintFor = (message) => {
  if (message.includes("bad auth") || message.includes("Authentication failed")) {
    return "Check the username and password inside DB_URL (a password with @ : / ? # must be URL-encoded).";
  }
  if (message.includes("querySrv") || message.includes("ENOTFOUND")) {
    return "The cluster hostname in DB_URL could not be resolved. Check it, or set DNS_SERVERS=8.8.8.8,1.1.1.1 in server/.env.";
  }
  if (message.includes("Server selection timed out") || message.includes("ETIMEDOUT")) {
    return "Atlas did not answer. Add your current IP under Network Access in Atlas, and check the cluster is not paused.";
  }
  return "";
};

start().catch((error) => {
  const message = error?.message || String(error);
  console.error(`[server] failed to start: ${message}`);
  const hint = hintFor(message);
  if (hint) console.error(`[server] ${hint}`);
  process.exit(1);
});
