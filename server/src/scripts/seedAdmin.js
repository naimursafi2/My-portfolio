/**
 * Creates (or updates) the single admin account from the environment.
 *
 *   npm run seed:admin
 *
 * Uses ADMIN_PASSWORD if present, otherwise the pre-computed ADMIN_PASSWORD_HASH.
 * Re-running it is safe: it updates the existing account instead of duplicating it.
 */
import bcrypt from "bcryptjs";
import { env, assertEnv } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { Admin } from "../models/Admin.js";

const run = async () => {
  assertEnv();

  if (!env.admin.email) throw new Error("ADMIN_EMAIL is not set in server/.env");
  if (!env.admin.password && !env.admin.passwordHash) {
    throw new Error("Set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH in server/.env");
  }

  await connectDB();

  const hash = env.admin.password
    ? await bcrypt.hash(env.admin.password, 12)
    : env.admin.passwordHash;

  const existing = await Admin.findOne({ email: env.admin.email });
  if (existing) {
    existing.name = env.admin.name;
    existing.password = hash;
    await existing.save();
    console.log(`[seed] updated admin account: ${existing.email}`);
  } else {
    const created = await Admin.create({
      name: env.admin.name,
      email: env.admin.email,
      password: hash,
    });
    console.log(`[seed] created admin account: ${created.email}`);
  }

  await disconnectDB();
};

run().catch(async (error) => {
  console.error("[seed] failed:", error.message);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
