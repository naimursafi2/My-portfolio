import { Folder, ExternalLink, Github, ImageIcon } from "lucide-react";
import { api } from "@/lib/api.js";
import { useApiData } from "@/hooks/useApi.js";

/** Projects with no image get a branded placeholder instead of a broken tile. */
const ProjectImage = ({ project }) =>
  project.image ? (
    <img
      src={project.image}
      alt={project.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/15 to-secondary text-muted-foreground">
      <ImageIcon size={26} />
      <span className="text-xs font-medium px-4 text-center">{project.title}</span>
    </div>
  );

const Projects = () => {
  const { data: projects, loading } = useApiData(api.getProjects, []);
  const list = projects || [];

  return (
    <section id="projects" className="py-24 bg-section-alt">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <Folder className="text-primary" size={24} />
          <h2 className="font-display text-3xl font-bold">Projects</h2>
        </div>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          A selection of things I have designed and built.
        </p>

        {loading && list.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl h-80 bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="text-muted-foreground">Projects are on their way - check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((p) => (
              <div
                key={p._id}
                className="flex flex-col rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all group hover:-translate-y-1 duration-300"
              >
                <div className="overflow-hidden h-48 shrink-0">
                  <ProjectImage project={p} />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-semibold mb-2 text-card-foreground">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {p.description}
                  </p>

                  {p.tech?.length > 0 && (
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
                  )}

                  <div className="flex gap-3 mt-auto">
                    {p.liveLink && (
                      <a
                        href={p.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                      >
                        Live Demo <ExternalLink size={14} />
                      </a>
                    )}
                    {p.githubLink && (
                      <a
                        href={p.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
                      >
                        GitHub <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
