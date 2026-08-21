import { Router } from "express";
import {
  listSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from "../controllers/skillController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { skillSchema, skillUpdateSchema, reorderSchema } from "../validation/schemas.js";

const router = Router();

// Public: the site reads the live skill list from here.
router.get("/", listSkills);

// Admin only.
router.post("/", requireAuth, validate(skillSchema), createSkill);
router.patch("/reorder", requireAuth, validate(reorderSchema), reorderSkills);
router.put("/:id", requireAuth, validate(skillUpdateSchema), updateSkill);
router.delete("/:id", requireAuth, deleteSkill);

export default router;
