import mongoose from "mongoose";

/**
 * A single document holding the editable "about me" content of the site.
 * Fetched and updated as a singleton - see Profile.getSingleton().
 */
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "Naimur Safi" },
    initials: { type: String, trim: true, default: "NS" },
    title: { type: String, trim: true, default: "Frontend Developer" },
    tagline: { type: String, trim: true, default: "" },
    availability: { type: String, trim: true, default: "Available for freelance work" },
    heroDescription: { type: String, trim: true, default: "" },
    // Each entry renders as one paragraph in the About section.
    aboutParagraphs: { type: [String], default: [] },
    contactBlurb: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    resumeUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

profileSchema.statics.getSingleton = async function getSingleton() {
  const existing = await this.findOne().sort({ createdAt: 1 });
  return existing || this.create({});
};

export const Profile = mongoose.model("Profile", profileSchema);
