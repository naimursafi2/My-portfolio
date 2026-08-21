import { env } from "../config/env.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";
  let details = err.details;

  if (err.name === "ValidationError") {
    status = 400;
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = "Validation failed";
  } else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for ${Object.keys(err.keyValue).join(", ")}`;
  } else if (err.code === "LIMIT_FILE_SIZE") {
    status = 413;
    message = "Image is too large (max 5MB)";
  }

  if (status >= 500) console.error("[error]", err);

  res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.nodeEnv === "development" && status >= 500 ? { stack: err.stack } : {}),
  });
};
