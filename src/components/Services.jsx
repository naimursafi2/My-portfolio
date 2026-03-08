import { useState } from "react";
import { Package, Check, Star, Zap, Crown } from "lucide-react";
import Checkout from "@/components/Checkout.jsx";

const packages = [
  {
    name: "Basic",
    price: "$199",
    icon: Zap,
    description: "Perfect for personal brands and simple online presence.",
    delivery: "3-5 days",
    features: [
      "Simple landing page",
      "Responsive design",
      "1 to 3 sections",
      "Clean modern UI",
      "Mobile friendly",
      "1 revision round",
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: "$499",
    icon: Star,
    description: "Ideal for businesses that need a professional multi-section website.",
    delivery: "7-10 days",
    features: [
      "Multi-section business website",
      "Responsive design",
      "Contact form integration",
      "Better UI/UX design",
      "SEO optimization",
      "Social media links",
      "3 revision rounds",
    ],
    popular: true,
  },
  {
    name: "Advanced",
    price: "$999",
    icon: Crown,
    description: "Full professional website with advanced features and customization.",
    delivery: "14-21 days",
    features: [
      "Full professional website",
      "Multiple pages",
      "API integration",
      "Advanced UI/UX design",
      "Extra customization",
      "Performance optimization",
      "Unlimited revisions",
      "Priority support",
    ],
    popular: false,
  },
];

const Services = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <>
      <section id="services" className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-primary" size={24} />
            <h2 className="font-display text-3xl font-bold">Services & Pricing</h2>
          </div>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            Choose the package that fits your needs. Every project is built with clean code,
            responsive design, and attention to detail.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                  pkg.popular
                    ? "bg-primary/5 border-primary shadow-lg shadow-primary/10 scale-105"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${pkg.popular ? "bg-primary/20" : "bg-secondary"}`}>
                    <pkg.icon size={20} className={pkg.popular ? "text-primary" : "text-muted-foreground"} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-card-foreground">{pkg.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-2">{pkg.description}</p>
                <p className="text-xs text-muted-foreground mb-6">Delivery: {pkg.delivery}</p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPackage(pkg)}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedPackage && (
        <Checkout
          selectedPackage={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </>
  );
};

export default Services;
