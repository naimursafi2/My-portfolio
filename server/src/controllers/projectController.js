import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notFound } from "../utils/ApiError.js";
import { destroyImage } from "../config/cloudinary.js";

export const listProjects = asyncHandler(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw notFound("Project not found");
  res.json({ success: true, data: project });
});

export const createProject = asyncHandler(async (req, res) => {
  if (req.body.order === undefined) {
    req.body.order = await Project.countDocuments();
  }
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const existing = await Project.findById(req.params.id);
  if (!existing) throw notFound("Project not found");

  const replacedImage =
    existing.imagePublicId &&
    req.body.imagePublicId !== undefined &&
    req.body.imagePublicId !== existing.imagePublicId
      ? existing.imagePublicId
      : null;

  existing.set(req.body);
  await existing.save();

  // Only drop the old Cloudinary asset once the new one is safely persisted.
  if (replacedImage) await destroyImage(replacedImage);

  res.json({ success: true, data: existing });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw notFound("Project not found");
  if (project.imagePublicId) await destroyImage(project.imagePublicId);
  res.json({ success: true, data: { id: req.params.id } });
});

export const reorderProjects = asyncHandler(async (req, res) => {
  await Project.bulkWrite(
    req.body.ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    }))
  );
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: projects });
});
