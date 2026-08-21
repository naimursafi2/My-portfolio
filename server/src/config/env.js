import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const pick = (...names) => {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return "";
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(pick("PORT")) || 5000,

  // The .env in this project uses DB_URL; MONGO_URI is accepted as an alias.
  mongoUri: pick("DB_URL", "MONGO_URI"),

  // Optional DNS resolver override for mongodb+srv lookups (see config/db.js).
  dnsServers: (pick("DNS_SERVERS") || "").split(",").map((s) => s.trim()).filter(Boolean),

  jwtSecret: pick("JWT_SECRET"),
  jwtExpiresIn: pick("JWT_EXPIRES_IN") || "7d",

  admin: {
    email: pick("ADMIN_EMAIL").toLowerCase(),
    name: pick("ADMIN_NAME") || "Site Owner",
    // Either a plaintext password (hashed by the seed script) or a ready bcrypt hash.
    password: pick("ADMIN_PASSWORD"),
    passwordHash: pick("ADMIN_PASSWORD_HASH"),
  },

  smtp: {
    service: pick("SMTP_SERVICE") || "gmail",
    host: pick("SMTP_HOST"),
    port: Number(pick("SMTP_PORT")) || undefined,
    user: pick("SMTP_USER", "EMAIL_USER"),
    // Gmail shows app passwords in groups of four; the spaces are not part of it.
    pass: pick("SMTP_PASS", "EMAIL_PASS").replace(/\s+/g, ""),
    from: pick("SMTP_FROM"),
    to: pick("OWNER_RECEIVING_EMAIL", "SMTP_TO", "SMTP_USER"),
  },

  cloudinary: {
    cloudName: pick("CLOUDINARY_CLOUD_NAME"),
    apiKey: pick("CLOUDINARY_API_KEY"),
    apiSecret: pick("CLOUDINARY_API_SECRET"),
    folder: pick("CLOUDINARY_FOLDER") || "portfolio",
  },

  // Comma-separated list of origins allowed to call this API.
  clientOrigins: (pick("CLIENT_URL") || "http://localhost:8080")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export const assertEnv = () => {
  const missing = [];
  if (!env.mongoUri) missing.push("DB_URL");
  if (!env.jwtSecret) missing.push("JWT_SECRET");
  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Copy server/.env.example to server/.env and fill them in."
    );
  }
  if (env.jwtSecret.length < 32) {
    console.warn("[env] JWT_SECRET is shorter than 32 characters - use a longer random secret.");
  }
};

export const isEmailConfigured = () => Boolean(env.smtp.user && env.smtp.pass);
export const isCloudinaryConfigured = () =>
  Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);
