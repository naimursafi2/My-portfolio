import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin and tools like curl send no Origin header.
        if (!origin || env.clientOrigins.includes("*") || env.clientOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  if (env.nodeEnv !== "test") app.use(morgan("dev"));

  app.get("/", (_req, res) => {
    res.json({ success: true, message: "Portfolio API", docs: "/api/health" });
  });

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
