import multer from "multer";
import { badRequest } from "../utils/ApiError.js";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/** Keeps the file in memory so it can be streamed straight to Cloudinary. */
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(badRequest(`Unsupported image type: ${file.mimetype}`));
    }
    cb(null, true);
  },
}).single("image");
