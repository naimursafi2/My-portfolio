import { Code2 } from "lucide-react";

const skills = [
  { name: "JavaScript", level: 85 },
  { name: "React", level: 80 },
  { name: "HTML", level: 95 },
  { name: "CSS / Tailwind CSS", level: 90 },
  { name: "Git & GitHub", level: 75 },
  { name: "REST API", level: 70 },
];

const Skills = () => (
  <section id="skills" className="py-24">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-12">
        <Code2 className="text-primary" size={24} />
        <h2 className="font-display text-3xl font-bold">Skills</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                {skill.name}
              </span>
              <span className="text-sm text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
