import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  submitMessage,
  listMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/contactController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { contactSchema } from "../validation/schemas.js";

const router = Router();

// Keeps the inbox clean: a handful of submissions per IP per hour.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "You have sent several messages already. Please try again later.",
  },
});

router.post("/", contactLimiter, validate(contactSchema), submitMessage);

// Admin only.
router.get("/", requireAuth, listMessages);
router.patch("/:id/read", requireAuth, markMessageRead);
router.delete("/:id", requireAuth, deleteMessage);

export default router;
