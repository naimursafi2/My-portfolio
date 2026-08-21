/**
 * Runs before `npm run dev` at the repo root. It checks the handful of things
 * that make the two dev servers fail with confusing errors, and explains how to
 * fix each one instead of letting Vite or Mongoose crash on its own terms.
 */
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];
const notes = [];

const at = (...parts) => path.join(root, ...parts);
const exists = (...parts) => fs.existsSync(at(...parts));

/** Minimal .env reader: KEY=value per line, spaces around `=` allowed, `#` comments. */
const readEnv = (file) => {
  const values = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const text = line.trim();
    if (!text || text.startsWith("#")) continue;
    const eq = text.indexOf("=");
    if (eq === -1) continue;
    values[text.slice(0, eq).trim()] = text.slice(eq + 1).trim();
  }
  return values;
};

// 1. Node version. `node --watch` (the server's dev script) needs 18.11+.
const major = Number(process.versions.node.split(".")[0]);
if (major < 18) {
  problems.push(
    `Node ${process.versions.node} is too old. Install Node 20 or newer from https://nodejs.org`
  );
}

// 2. Dependencies. The root postinstall installs both, but a folder can still be
//    missing if someone installed only one side.
for (const folder of ["server", "client"]) {
  if (!exists(folder, "node_modules")) {
    problems.push(`${folder}/node_modules is missing. Run: npm install`);
  }
}

// 3. The server cannot start without its own .env - it holds the database URI.
if (!exists("server", ".env")) {
  problems.push(
    "server/.env is missing. Run: cp server/.env.example server/.env\n" +
      "     then fill in DB_URL and JWT_SECRET (see server/README.md)."
  );
} else {
  const values = readEnv(at("server", ".env"));
  if (!values.DB_URL && !values.MONGO_URI) {
    problems.push("server/.env has no DB_URL. Paste your MongoDB connection string into it.");
  }
  if (!values.JWT_SECRET) {
    problems.push("server/.env has no JWT_SECRET. Set it to a long random string.");
  }
}

// 4. client/.env is optional - lib/api.js falls back to localhost:5000.
if (!exists("client", ".env")) {
  notes.push("client/.env is missing; the client will default to http://localhost:5000/api");
}

// 5. Ports. A leftover dev server from a previous session is the most common
//    cause of "it starts, but the site 404s".
const portFree = (port) =>
  new Promise((resolve) => {
    const probe = net
      .createServer()
      .once("error", (error) => resolve(error.code !== "EADDRINUSE"))
      .once("listening", () => probe.close(() => resolve(true)))
      .listen(port, "0.0.0.0");
  });

const serverPort = exists("server", ".env") ? readEnv(at("server", ".env")).PORT : "";

for (const [port, label] of [
  [Number(serverPort) || 5000, "the API"],
  [8080, "the site"],
]) {
  if (!(await portFree(port))) {
    problems.push(
      `Port ${port} (${label}) is already in use - most likely a dev server left running.\n` +
        "     Run: npm run stop"
    );
  }
}

for (const note of notes) console.log(`[preflight] note: ${note}`);

if (problems.length) {
  console.error("\n[preflight] cannot start the dev servers:\n");
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("");
  process.exit(1);
}
