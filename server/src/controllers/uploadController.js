import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest, ApiError } from "../utils/ApiError.js";
import { uploadBuffer, destroyImage } from "../config/cloudinary.js";
import { isCloudinaryConfigured } from "../config/env.js";

export const uploadProjectImage = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(503, "Image uploads are not configured (CLOUDINARY_* env vars missing)");
  }
  if (!req.file) throw badRequest("No image file received - expected form field 'image'");

  const result = await uploadBuffer(req.file.buffer);

  res.status(201).json({
    success: true,
    data: { url: result.secure_url, publicId: result.public_id },
  });
});

export const deleteUploadedImage = asyncHandler(async (req, res) => {
  const publicId = req.query.publicId || req.body?.publicId;
  if (!publicId) throw badRequest("publicId is required");
  await destroyImage(publicId);
  res.json({ success: true, data: { publicId } });
});
