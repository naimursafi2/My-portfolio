import { MessageSquareQuote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Owner",
    text: "Naimur delivered an outstanding website for my business. Clean design, responsive, and exactly what I envisioned. Highly recommend!",
    rating: 5,
  },
  {
    name: "Alex Chen",
    role: "Startup Founder",
    text: "Professional, detail-oriented, and great communication throughout the project. The final product exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Maria Rodriguez",
    role: "Freelancer",
    text: "My portfolio website looks amazing! Naimur understood my vision perfectly and delivered ahead of schedule. Will work with again.",
    rating: 5,
  },
];

const Testimonials = () => (
  <section className="py-24 bg-section-alt">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquareQuote className="text-primary" size={24} />
        <h2 className="font-display text-3xl font-bold">Client Reviews</h2>
      </div>
      <p className="text-muted-foreground mb-12 max-w-2xl">
        What my clients say about working with me.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 duration-300"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm italic">
              "{t.text}"
            </p>
            <div>
              <p className="font-medium text-card-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
