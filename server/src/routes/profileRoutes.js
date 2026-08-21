import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { profileSchema } from "../validation/schemas.js";

const router = Router();

router.get("/", getProfile);
router.put("/", requireAuth, validate(profileSchema), updateProfile);

export default router;
