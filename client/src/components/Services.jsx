import { Package, Check, Layout, Store, Code2 } from "lucide-react";

const services = [
  {
    name: "Landing Pages",
    icon: Layout,
    description: "Single-page sites that introduce a personal brand or product and convert visitors.",
    points: ["Clean, modern UI", "Fully responsive", "Fast loading", "SEO friendly"],
  },
  {
    name: "Business Websites",
    icon: Store,
    description: "Multi-section websites that give a business a credible, professional home online.",
    points: ["Multi-page layouts", "Contact form integration", "Thoughtful UI/UX", "Social media links"],
  },
  {
    name: "Web Applications",
    icon: Code2,
    description: "Full-stack applications with a React frontend and a Node, Express, and MongoDB backend.",
    points: ["REST API development", "Database design", "Authentication", "Admin dashboards"],
  },
];

const Services = () => (
  <section id="services" className="py-24">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-4">
        <Package className="text-primary" size={24} />
        <h2 className="font-display text-3xl font-bold">Services</h2>
      </div>
      <p className="text-muted-foreground mb-12 max-w-2xl">
        Here is what I can build for you. Every project is delivered with clean code, responsive
        design, and attention to detail. Get in touch and we can talk through what you need.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
        {services.map((service) => (
          <div
            key={service.name}
            className="rounded-2xl p-8 bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary">
                <service.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-card-foreground">{service.name}</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

            <ul className="space-y-3">
              {service.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="text-primary mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Discuss your project
        </a>
      </div>
    </div>
  </section>
);

export default Services;
