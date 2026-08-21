import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (admin) =>
  jwt.sign({ sub: String(admin._id), email: admin.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
