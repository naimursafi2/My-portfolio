import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * mongodb+srv:// URIs require an SRV DNS lookup, and some local resolvers
 * (a 127.0.0.1 stub resolver, corporate DNS, a VPN) refuse to answer it. The
 * connection then fails with `querySrv ECONNREFUSED` even though the internet
 * is fine and the credentials are correct.
 *
 * DNS_SERVERS in .env pins the resolvers explicitly. If it is not set and the
 * first attempt fails on exactly that lookup, we retry once through public
 * resolvers rather than making the developer diagnose their DNS setup.
 */
const PUBLIC_RESOLVERS = ["8.8.8.8", "1.1.1.1"];

const DNS_FAILURE_CODES = ["ECONNREFUSED", "ESERVFAIL", "EREFUSED", "ETIMEOUT", "ENOTFOUND"];

const isSrvLookupFailure = (error) => {
  const message = error?.message || "";
  if (!message.includes("querySrv") && !message.includes("queryTxt")) return false;
  return DNS_FAILURE_CODES.some((code) => message.includes(code));
};

const connect = () =>
  mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 15000,
  });

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  const pinned = env.dnsServers.length > 0;
  if (pinned) {
    dns.setServers(env.dnsServers);
    console.log(`[db] using DNS servers from DNS_SERVERS: ${env.dnsServers.join(", ")}`);
  }

  let conn;
  try {
    conn = await connect();
  } catch (error) {
    // Only the SRV lookup is worth retrying; a bad password or a paused cluster
    // will fail the same way twice.
    if (pinned || !isSrvLookupFailure(error)) throw error;

    console.warn(
      `[db] SRV lookup failed through ${dns.getServers().join(", ")} - ` +
        `retrying through ${PUBLIC_RESOLVERS.join(", ")}`
    );
    console.warn("[db] set DNS_SERVERS in .env to skip this retry next time");
    dns.setServers(PUBLIC_RESOLVERS);
    conn = await connect();
  }

  console.log(`[db] connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

export const disconnectDB = () => mongoose.disconnect();
