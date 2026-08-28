import { Mail, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api.js";
import { useApiData } from "@/hooks/useApi.js";

const EMPTY = { name: "", email: "", message: "", website: "" };

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const { data: profile } = useApiData(api.getProfile, null);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);
    try {
      await api.sendMessage(form);
      toast.success("Message sent. I'll get back to you soon!");
      setForm(EMPTY);
    } catch (error) {
      toast.error(error.details?.[0]?.message || error.message || "Could not send your message");
    } finally {
      setSending(false);
    }
  };

  const blurb =
    profile?.contactBlurb ||
    "Have a project in mind? Want to hire me for your business website? Feel free to reach out. I'm always happy to discuss new opportunities!";

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="text-primary" size={24} />
          <h2 className="font-display text-3xl font-bold">Let's Connect</h2>
        </div>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Tell me about your project and I'll reply personally.
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium mb-2 text-foreground">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={update("name")}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Your name"
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium mb-2 text-foreground">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={update("email")}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="your@email.com"
                maxLength={255}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium mb-2 text-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={update("message")}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Your message..."
                maxLength={1000}
              />
            </div>

            {/* Honeypot: hidden from people, tempting to bots. */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={update("website")}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  Sending <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Send Message <Send size={16} />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col justify-center">
            <p className="text-muted-foreground mb-8 leading-relaxed">{blurb}</p>
            <div className="flex gap-4">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-3 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label="Email"
                >
                  <Mail size={22} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
