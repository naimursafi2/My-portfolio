import { z } from "zod";

const trimmed = (max) => z.string().trim().max(max);
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v) || v.startsWith("/"), {
    message: "Must be a valid http(s) URL",
  })
  .optional()
  .default("");

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  password: z.string().min(1, "Password is required").max(200),
});

export const skillSchema = z.object({
  name: trimmed(60).min(1, "Skill name is required"),
  icon: trimmed(120).optional().default(""),
  category: trimmed(60).optional().default(""),
  order: z.coerce.number().int().min(0).max(9999).optional(),
});

export const skillUpdateSchema = skillSchema.partial();

export const projectSchema = z.object({
  title: trimmed(120).min(1, "Title is required"),
  description: trimmed(1000).min(1, "Description is required"),
  image: optionalUrl,
  imagePublicId: trimmed(200).optional().default(""),
  tech: z
    .union([z.array(trimmed(40)), z.string()])
    .optional()
    .default([])
    .transform((value) =>
      (Array.isArray(value) ? value : value.split(","))
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 12)
    ),
  liveLink: optionalUrl,
  githubLink: optionalUrl,
  featured: z.coerce.boolean().optional(),
  order: z.coerce.number().int().min(0).max(9999).optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export const reorderSchema = z.object({
  ids: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid id")).min(1),
});

export const contactSchema = z.object({
  name: trimmed(100).min(2, "Please enter your name"),
  email: z.string().trim().toLowerCase().email("A valid email is required").max(255),
  message: trimmed(5000).min(10, "Message should be at least 10 characters"),
  // Hidden honeypot field that real users never fill in.
  website: z.string().max(0).optional().default(""),
});

export const profileSchema = z.object({
  name: trimmed(80).optional(),
  initials: trimmed(4).optional(),
  title: trimmed(120).optional(),
  tagline: trimmed(200).optional(),
  availability: trimmed(120).optional(),
  heroDescription: trimmed(500).optional(),
  aboutParagraphs: z
    .union([z.array(trimmed(1500)), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      const list = Array.isArray(value) ? value : value.split(/\n{2,}/);
      return list.map((p) => p.trim()).filter(Boolean).slice(0, 8);
    }),
  contactBlurb: trimmed(500).optional(),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  github: optionalUrl,
  linkedin: optionalUrl,
  resumeUrl: optionalUrl,
});
