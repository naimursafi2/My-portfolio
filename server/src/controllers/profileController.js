import { Profile } from "../models/Profile.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (_req, res) => {
  const profile = await Profile.getSingleton();
  res.json({ success: true, data: profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.getSingleton();
  profile.set(req.body);
  await profile.save();
  res.json({ success: true, data: profile });
});
