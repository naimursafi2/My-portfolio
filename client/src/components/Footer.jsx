import { Github, Linkedin, Facebook, Mail } from "lucide-react";
import { api } from "@/lib/api.js";
import { useApiData } from "@/hooks/useApi.js";

const Footer = () => {
  const { data: profile } = useApiData(api.getProfile, null);
  const initials = profile?.initials || "NS";
  const name = profile?.name || "Naimur Safi";
  const github = profile?.github || "https://github.com/naimursafi2";
  const linkedin = profile?.linkedin || "https://www.linkedin.com/in/naimur-safi-ab587a261/";
  const facebook = "https://www.facebook.com/naimursafi2";

  const socialLinks = [
    { href: facebook, label: "Facebook", Icon: Facebook },
    { href: linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: github, label: "GitHub", Icon: Github },
  ];

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="font-display text-xl font-bold text-gradient">{initials}</span>
            <p className="text-sm text-muted-foreground mt-2">
              {profile?.title || "Frontend Developer"} building modern web experiences.
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
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 hover:-translate-y-0.5 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {name}. Built with React, Tailwind CSS, Express &amp; MongoDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
