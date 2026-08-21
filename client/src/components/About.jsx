import { User } from "lucide-react";
import { api } from "@/lib/api.js";
import { useApiData } from "@/hooks/useApi.js";

const FALLBACK_PARAGRAPHS = [
  "I am a passionate Frontend Developer who loves building modern and responsive web applications using React and JavaScript. My journey in web development started with curiosity about how websites work, and it quickly turned into a deep passion for creating intuitive user interfaces.",
  "I specialize in React, Next.js, JavaScript, responsive design, clean UI, and API integration. Recently I have been working across the full stack with Node.js, Express.js, MongoDB, and Mongoose.",
  "Whether you need a personal portfolio, a business website, or a custom web app, I deliver professional, high-quality results that help you stand out online.",
];

const About = () => {
  const { data: profile } = useApiData(api.getProfile, null);
  const paragraphs = profile?.aboutParagraphs?.length
    ? profile.aboutParagraphs
    : FALLBACK_PARAGRAPHS;

  return (
    <section id="about" className="py-24 bg-section-alt">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-12">
          <User className="text-primary" size={24} />
          <h2 className="font-display text-3xl font-bold">About Me</h2>
        </div>

        <div className="max-w-3xl">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-lg text-muted-foreground leading-relaxed ${
                index < paragraphs.length - 1 ? "mb-6" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
