import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * mongodb+srv:// URIs need an SRV DNS lookup, which some local resolvers
 * (corporate DNS, VPNs, a 127.0.0.1 stub resolver) refuse with ECONNREFUSED.
 * Setting DNS_SERVERS in .env routes lookups to a resolver that answers them.
 */
const applyDnsOverride = () => {
  if (!env.dnsServers.length) return;
  dns.setServers(env.dnsServers);
  console.log(`[db] using DNS servers: ${env.dnsServers.join(", ")}`);
};

export const connectDB = async () => {
  applyDnsOverride();
  mongoose.set("strictQuery", true);

  const conn = await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`[db] connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

export const disconnectDB = () => mongoose.disconnect();
