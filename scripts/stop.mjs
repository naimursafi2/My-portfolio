/**
 * `npm run stop` - free the two dev ports.
 *
 * Closing the terminal window instead of pressing Ctrl+C can leave the API or
 * Vite running with nothing attached to them, and the next `npm run dev` then
 * fails with "port already in use". This finds whatever is listening on those
 * ports and stops it, naming each process before it does.
 */
import { execFileSync } from "node:child_process";

const PORTS = [5000, 8080];
const isWindows = process.platform === "win32";

const run = (command, args) => {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return "";
  }
};

/** PIDs listening on a port, as strings. */
const listeners = (port) => {
  const found = new Set();

  if (isWindows) {
    for (const line of run("netstat", ["-ano"]).split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/);
      // proto  local            foreign   state       pid
      if (parts.length < 5 || parts[3] !== "LISTENING") continue;
      if (!parts[1].endsWith(`:${port}`)) continue;
      found.add(parts[4]);
    }
  } else {
    for (const pid of run("lsof", ["-ti", `:${port}`, "-sTCP:LISTEN"]).split(/\r?\n/)) {
      if (pid.trim()) found.add(pid.trim());
    }
  }

  found.delete(String(process.pid));
  found.delete("0");
  return [...found];
};

/** Best-effort name for a PID, so nothing unexpected is killed silently. */
const nameOf = (pid) => {
  if (isWindows) {
    const row = run("tasklist", ["/FI", `PID eq ${pid}`, "/NH", "/FO", "CSV"]);
    return row.split('","')[0].replace(/"/g, "").trim() || "unknown";
  }
  return run("ps", ["-p", pid, "-o", "comm="]).trim() || "unknown";
};

const kill = (pid) => {
  if (isWindows) run("taskkill", ["/F", "/T", "/PID", pid]);
  else run("kill", ["-9", pid]);
};

let stopped = 0;
for (const port of PORTS) {
  for (const pid of listeners(port)) {
    console.log(`[stop] port ${port}: stopping ${nameOf(pid)} (pid ${pid})`);
    kill(pid);
    stopped += 1;
  }
}

console.log(stopped ? `[stop] freed ${PORTS.join(" and ")}` : "[stop] nothing was running");
