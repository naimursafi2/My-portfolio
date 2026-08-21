/**
 * Fills an empty database with the content that used to be hardcoded in the
 * frontend, so the site looks the same the first time it runs off the API.
 *
 *   npm run seed:content            # only fills collections that are empty
 *   npm run seed:content -- --force # wipes skills/projects/profile and reseeds
 *
 * Contact messages are never touched.
 */
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { assertEnv, isCloudinaryConfigured } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { uploadBuffer } from "../config/cloudinary.js";
import { Skill } from "../models/Skill.js";
import { Project } from "../models/Project.js";
import { Profile } from "../models/Profile.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../../../client/src/assets");
const force = process.argv.includes("--force");

const SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mongoose",
  "REST API",
  "Git & GitHub",
  "Responsive Design",
];

const PROJECTS = [
  {
    title: "Weather Dashboard",
    description:
      "A real-time weather dashboard with location search, 7-day forecast, and interactive charts.",
    asset: "project1.jpg",
    tech: ["React", "Tailwind CSS", "OpenWeather API"],
  },
  {
    title: "E-Commerce Store",
    description:
      "A responsive online store with product filtering, cart management, and checkout flow.",
    asset: "project2.jpg",
    tech: ["React", "Redux", "REST API"],
  },
  {
    title: "Task Manager",
    description:
      "A kanban-style task management app with drag-and-drop, categories, and progress tracking.",
    asset: "project3.jpg",
    tech: ["React", "JavaScript", "Tailwind CSS"],
  },
  {
    title: "Portfolio CMS",
    description:
      "This very site: a React frontend backed by an Express and MongoDB API with a JWT-protected admin dashboard for managing every section.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
  },
  {
    title: "Blog REST API",
    description:
      "A REST API for a blogging platform with authentication, posts, comments, and role-based permissions, documented end to end.",
    tech: ["Node.js", "Express.js", "Mongoose", "JWT"],
  },
  {
    title: "Restaurant Landing Page",
    description:
      "A fast, mobile-first landing page with an online menu, reservation form, and smooth scroll animations.",
    tech: ["React", "Tailwind CSS", "Responsive Design"],
  },
];

const PROFILE = {
  name: "Naimur Safi",
  initials: "NS",
  title: "Frontend Developer",
  availability: "Available for freelance work",
  heroDescription:
    "I build modern, responsive, and professional websites for businesses and personal brands. Passionate about clean code and great user experiences.",
  aboutParagraphs: [
    "I am a passionate Frontend Developer who loves building modern and responsive web applications using React and JavaScript. My journey in web development started with curiosity about how websites work, and it quickly turned into a deep passion for creating intuitive user interfaces.",
    "I specialize in React, Next.js, JavaScript, responsive design, clean UI, and API integration. Recently I have been working across the full stack with Node.js, Express.js, MongoDB, and Mongoose.",
    "Whether you need a personal portfolio, a business website, or a custom web app, I deliver professional, high-quality results that help you stand out online.",
  ],
  contactBlurb:
    "Have a project in mind? Want to hire me for your business website? Feel free to reach out - I am always happy to discuss new opportunities.",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
};

/**
 * Uploads a bundled sample image to Cloudinary. When Cloudinary is unavailable
 * the copy in client/public/projects is used, so the site still has images.
 */
const uploadAsset = async (fileName) => {
  if (!fileName) return { image: "", imagePublicId: "" };

  const localPath = "/projects/" + fileName;
  if (!isCloudinaryConfigured()) return { image: localPath, imagePublicId: "" };

  try {
    const buffer = await fs.readFile(path.join(assetsDir, fileName));
    const result = await uploadBuffer(buffer, {
      folder: "portfolio/seed",
      publicId: path.parse(fileName).name,
    });
    console.log("[seed] uploaded " + fileName);
    return { image: result.secure_url, imagePublicId: result.public_id };
  } catch (error) {
    console.warn(
      "[seed] Cloudinary upload of " + fileName + " failed (" + error.message +
        ") - falling back to " + localPath
    );
    return { image: localPath, imagePublicId: "" };
  }
};

const run = async () => {
  assertEnv();
  await connectDB();

  if (force) {
    await Promise.all([Skill.deleteMany({}), Project.deleteMany({}), Profile.deleteMany({})]);
    console.log("[seed] cleared skills, projects and profile");
  }

  if (await Skill.countDocuments()) {
    console.log("[seed] skills already present, skipping");
  } else {
    await Skill.insertMany(SKILLS.map((name, order) => ({ name, order })));
    console.log("[seed] inserted " + SKILLS.length + " skills");
  }

  if (await Project.countDocuments()) {
    console.log("[seed] projects already present, skipping");
  } else {
    const docs = [];
    for (const [order, { asset, ...project }] of PROJECTS.entries()) {
      docs.push({ ...project, ...(await uploadAsset(asset)), order });
    }
    await Project.insertMany(docs);
    console.log("[seed] inserted " + docs.length + " projects");
  }

  const profile = await Profile.getSingleton();
  if (!force && profile.aboutParagraphs.length) {
    console.log("[seed] profile already filled in, skipping");
  } else {
    profile.set(PROFILE);
    await profile.save();
    console.log("[seed] profile saved");
  }

  await disconnectDB();
  console.log("[seed] done");
};

run().catch(async (error) => {
  console.error("[seed] failed:", error.message);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
