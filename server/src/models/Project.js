import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    image: { type: String, trim: true, default: "" },
    // Set when the image was uploaded through Cloudinary, so it can be cleaned up later.
    imagePublicId: { type: String, trim: true, default: "" },
    tech: { type: [String], default: [] },
    liveLink: { type: String, trim: true, default: "" },
    githubLink: { type: String, trim: true, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1, createdAt: -1 });

export const Project = mongoose.model("Project", projectSchema);
