import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Folder, ExternalLink, Github, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api.js";
import { useApiData } from "@/hooks/useApi.js";

const AUTOPLAY_DELAY = 4500;

/** Projects with no image get a branded placeholder instead of a broken tile. */
const ProjectImage = ({ project }) =>
  project.image ? (
    <img
      src={project.image}
      alt={project.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
      draggable={false}
    />
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-primary/15 to-secondary text-muted-foreground">
      <ImageIcon size={20} />
      <span className="text-xs font-medium px-4 text-center">{project.title}</span>
    </div>
  );

const ProjectCard = ({ p }) => {
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all group hover:-translate-y-1 duration-300 select-none">
      <div className="overflow-hidden h-36 shrink-0">
        <ProjectImage project={p} />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-base font-semibold mb-1 text-card-foreground line-clamp-1">
          {p.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 leading-snug line-clamp-2">
          {p.description}
        </p>

        {p.tech?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-1">
          {p.liveLink && (
            <a
              href={p.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Live Demo <ExternalLink size={12} />
            </a>
          )}
          {p.githubLink && (
            <a
              href={p.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
            >
              GitHub <Github size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectsCarousel = ({ list }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const autoplayRef = useRef(null);
  const hoveringRef = useRef(false);
  const interactingRef = useRef(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback((api) => {
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!emblaApi) return;
    autoplayRef.current = setInterval(() => {
      if (hoveringRef.current || interactingRef.current) return;
      emblaApi.scrollNext();
    }, AUTOPLAY_DELAY);
  }, [emblaApi, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    startAutoplay();

    const onPointerDown = () => {
      interactingRef.current = true;
    };
    const onSettle = () => {
      interactingRef.current = false;
    };

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("settle", onSettle);

    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("settle", onSettle);
      stopAutoplay();
    };
  }, [emblaApi, startAutoplay, stopAutoplay]);

  return (
    <div
      className="relative group/carousel"
      onMouseEnter={() => (hoveringRef.current = true)}
      onMouseLeave={() => (hoveringRef.current = false)}
    >
      <div className="overflow-hidden -mx-2" ref={emblaRef}>
        <div className="flex">
          {list.map((p) => (
            <div
              key={p._id}
              className="shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 px-2"
            >
              <ProjectCard p={p} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canPrev}
        aria-label="Previous projects"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-foreground shadow-lg opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canNext}
        aria-label="Next projects"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-foreground shadow-lg opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl h-64 bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="text-muted-foreground">Projects are on their way - check back soon.</p>
        ) : (
          <ProjectsCarousel list={list} />
        )}
      </div>
    </section>
  );
};

export default Projects;
