import { User } from "lucide-react";

const About = () => (
  <section id="about" className="py-24 bg-section-alt">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-12">
        <User className="text-primary" size={24} />
        <h2 className="font-display text-3xl font-bold">About Me</h2>
      </div>

      <div className="max-w-3xl">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          I am a passionate Frontend Developer who loves building modern and
          responsive web applications using React and JavaScript. My journey in
          web development started with curiosity about how websites work, and
          it quickly turned into a deep passion for creating intuitive user
          interfaces.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          I enjoy learning new technologies, exploring best practices, and
          improving my problem-solving skills every day. I believe in writing
          clean, maintainable code and delivering great user experiences.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Currently, I'm focused on deepening my expertise in the React
          ecosystem, mastering TypeScript, and contributing to open-source
          projects. I'm always open to collaboration and new opportunities!
        </p>
      </div>
    </div>
  </section>
);

export default About;
