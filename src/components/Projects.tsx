import { Folder, ExternalLink, Github } from "lucide-react";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";

const projects = [
  {
    title: "Weather Dashboard",
    description: "A real-time weather dashboard with location search, 7-day forecast, and interactive charts.",
    image: project1,
    tech: ["React", "Tailwind CSS", "OpenWeather API"],
    demo: "#",
    github: "#",
  },
  {
    title: "E-Commerce Store",
    description: "A responsive online store with product filtering, cart management, and checkout flow.",
    image: project2,
    tech: ["React", "Redux", "REST API"],
    demo: "#",
    github: "#",
  },
  {
    title: "Task Manager",
    description: "A kanban-style task management app with drag-and-drop, categories, and progress tracking.",
    image: project3,
    tech: ["React", "TypeScript", "Tailwind CSS"],
    demo: "#",
    github: "#",
  },
];

const Projects = () => (
  <section id="projects" className="py-24 bg-section-alt">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-12">
        <Folder className="text-primary" size={24} />
        <h2 className="font-display text-3xl font-bold">Projects</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <div
            key={p.title}
            className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all group hover:-translate-y-1 duration-300"
          >
            <div className="overflow-hidden h-48">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-semibold mb-2 text-card-foreground">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={p.demo}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Live Demo <ExternalLink size={14} />
                </a>
                <a
                  href={p.github}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
                >
                  GitHub <Github size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
