import { Router } from "express";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { projectSchema, projectUpdateSchema, reorderSchema } from "../validation/schemas.js";

const router = Router();

// Public: the site reads the live project list from here.
router.get("/", listProjects);
router.get("/:id", getProject);

// Admin only.
router.post("/", requireAuth, validate(projectSchema), createProject);
router.patch("/reorder", requireAuth, validate(reorderSchema), reorderProjects);
router.put("/:id", requireAuth, validate(projectUpdateSchema), updateProject);
router.delete("/:id", requireAuth, deleteProject);

export default router;
