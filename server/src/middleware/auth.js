import { Admin } from "../models/Admin.js";
import { verifyToken } from "../utils/token.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { unauthorized } from "../utils/ApiError.js";

const extractToken = (req) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  return "";
};

/**
 * Guards every admin-only route: a missing, malformed or expired token is
 * rejected with 401 before the controller ever runs.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) throw unauthorized("Authentication token missing");

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw unauthorized("Invalid or expired token");
  }

  const admin = await Admin.findById(payload.sub);
  if (!admin) throw unauthorized("Account no longer exists");

  req.admin = { id: String(admin._id), email: admin.email, name: admin.name };
  next();
});
