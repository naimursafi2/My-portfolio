import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, me } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema } from "../validation/schemas.js";

const router = Router();

// Slows down password guessing without locking the owner out for long.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again in 15 minutes." },
});

router.post("/login", loginLimiter, validate(loginSchema), login);
router.get("/me", requireAuth, me);

export default router;
