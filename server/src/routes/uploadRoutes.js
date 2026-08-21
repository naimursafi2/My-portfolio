import { Router } from "express";
import { uploadProjectImage, deleteUploadedImage } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = Router();

// Admin only - uploads go straight to Cloudinary.
router.post("/", requireAuth, uploadImage, uploadProjectImage);
router.delete("/", requireAuth, deleteUploadedImage);

export default router;
