import { Router } from "express";
import authRoutes from "./authRoutes.js";
import skillRoutes from "./skillRoutes.js";
import projectRoutes from "./projectRoutes.js";
import contactRoutes from "./contactRoutes.js";
import profileRoutes from "./profileRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/skills", skillRoutes);
router.use("/projects", projectRoutes);
router.use("/contact", contactRoutes);
router.use("/profile", profileRoutes);
router.use("/upload", uploadRoutes);

export default router;
