import { Code2 } from "lucide-react";
import { api } from "@/lib/api.js";
import { useApiData } from "@/hooks/useApi.js";

// Shown only if the API cannot be reached, so the section is never empty.
const FALLBACK = [
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
].map((name) => ({ _id: name, name }));

const Skills = () => {
  const { data: skills, loading } = useApiData(api.getSkills, FALLBACK);
  const list = skills?.length ? skills : FALLBACK;

  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="text-primary" size={24} />
          <h2 className="font-display text-3xl font-bold">Skills</h2>
        </div>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          The tools and technologies I work with day to day.
        </p>

        <div
          className={`flex flex-wrap gap-3 max-w-4xl transition-opacity duration-300 ${
            loading ? "opacity-60" : "opacity-100"
          }`}
        >
          {list.map((skill) => (
            <span
              key={skill._id || skill.name}
              className="px-5 py-2.5 rounded-full bg-card border border-border text-card-foreground font-medium hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
