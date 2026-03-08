import { ArrowDown, ExternalLink, Sparkles } from "lucide-react";

const Hero = () => (
  <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

    <div className="container mx-auto px-4 text-center relative z-10">
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles size={14} /> Available for freelance work
        </span>
      </div>

      <h1
        className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        Hi, I'm{" "}
        <span className="text-gradient">Naimur Safi</span>
      </h1>

      <p
        className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        Frontend Developer
      </p>

      <p
        className="text-base text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        I build modern, responsive, and professional websites for businesses and personal brands.
        Passionate about clean code and great user experiences.
      </p>

      <div
        className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
        style={{ animationDelay: "0.4s" }}
      >
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          View Projects <ExternalLink size={16} />
        </a>
        <a
          href="#services"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Get Started
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
        >
          Hire Me
        </a>
      </div>

      <a
        href="#about"
        className="inline-block mt-16 animate-bounce text-muted-foreground hover:text-primary transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </a>
    </div>
  </section>
);

export default Hero;
