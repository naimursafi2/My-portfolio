import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";
import { unauthorized } from "../utils/ApiError.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  // Same message either way so the endpoint cannot be used to probe for accounts.
  if (!admin || !(await admin.comparePassword(password))) {
    throw unauthorized("Invalid email or password");
  }

  res.json({
    success: true,
    token: signToken(admin),
    admin: { id: admin._id, name: admin.name, email: admin.email },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin.id).select("+password");
  if (!admin || !(await admin.comparePassword(currentPassword))) {
    throw unauthorized("Current password is incorrect");
  }

  admin.password = await bcrypt.hash(newPassword, 12);
  await admin.save();

  res.json({ success: true, message: "Password changed successfully" });
});
