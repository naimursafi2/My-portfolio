import { Github, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <span className="font-display text-xl font-bold text-gradient">NS</span>
          <p className="text-sm text-muted-foreground mt-2">
            Frontend Developer building modern web experiences.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["About", "Skills", "Projects", "Services", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-3">Connect</h4>
          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Naimur Safi. Built with React & Tailwind CSS.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
