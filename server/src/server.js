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

  const shutdown = (signal) => () => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown("SIGINT"));
  process.on("SIGTERM", shutdown("SIGTERM"));
};

start().catch((error) => {
  console.error("[server] failed to start:", error.message);
  process.exit(1);
});
