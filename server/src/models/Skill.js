import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    // Optional lucide-react icon name (e.g. "Code2") or an image URL.
    icon: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

skillSchema.index({ order: 1, createdAt: 1 });

export const Skill = mongoose.model("Skill", skillSchema);
