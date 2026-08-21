import { Skill } from "../models/Skill.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notFound } from "../utils/ApiError.js";

export const listSkills = asyncHandler(async (_req, res) => {
  const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: skills.length, data: skills });
});

export const createSkill = asyncHandler(async (req, res) => {
  if (req.body.order === undefined) {
    req.body.order = await Skill.countDocuments();
  }
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, data: skill });
});

export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) throw notFound("Skill not found");
  res.json({ success: true, data: skill });
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) throw notFound("Skill not found");
  res.json({ success: true, data: { id: req.params.id } });
});

export const reorderSkills = asyncHandler(async (req, res) => {
  await Skill.bulkWrite(
    req.body.ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    }))
  );
  const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: skills });
});
