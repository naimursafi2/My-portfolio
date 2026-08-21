import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api.js";
import { PanelHeader, Field, TextInput, TextArea, Button, Spinner } from "./ui.jsx";

const EMPTY = {
  name: "",
  initials: "",
  title: "",
  availability: "",
  heroDescription: "",
  aboutParagraphs: "",
  contactBlurb: "",
  email: "",
  github: "",
  linkedin: "",
};

const ProfilePanel = () => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.getProfile();
        setForm({
          ...EMPTY,
          ...data,
          // Paragraphs are edited as one textarea, split on blank lines.
          aboutParagraphs: (data.aboutParagraphs || []).join("\n\n"),
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.updateProfile({
        name: form.name,
        initials: form.initials,
        title: form.title,
        availability: form.availability,
        heroDescription: form.heroDescription,
        aboutParagraphs: form.aboutParagraphs,
        contactBlurb: form.contactBlurb,
        email: form.email,
        github: form.github,
        linkedin: form.linkedin,
      });
      setForm((prev) => ({
        ...prev,
        ...data,
        aboutParagraphs: (data.aboutParagraphs || []).join("\n\n"),
      }));
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error.details?.[0]?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading profile" />;

  return (
    <div>
      <PanelHeader
        title="Profile"
        description="The text in the hero, about and contact sections, plus your social links."
      />

      <form onSubmit={save} className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-3xl">
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2">
            <Field label="Name" htmlFor="profile-name">
              <TextInput
                id="profile-name"
                value={form.name}
                onChange={update("name")}
                maxLength={80}
              />
            </Field>
          </div>
          <Field label="Initials" htmlFor="profile-initials" hint="Shown in the navbar and footer.">
            <TextInput
              id="profile-initials"
              value={form.initials}
              onChange={update("initials")}
              maxLength={4}
            />
          </Field>
        </div>

        <Field label="Title" htmlFor="profile-title" hint="e.g. Frontend Developer">
          <TextInput
            id="profile-title"
            value={form.title}
            onChange={update("title")}
            maxLength={120}
          />
        </Field>

        <Field
          label="Availability badge"
          htmlFor="profile-availability"
          hint="The pill at the top of the hero. Leave empty to hide it."
        >
          <TextInput
            id="profile-availability"
            value={form.availability}
            onChange={update("availability")}
            maxLength={120}
          />
        </Field>

        <Field label="Hero description" htmlFor="profile-hero">
          <TextArea
            id="profile-hero"
            value={form.heroDescription}
            onChange={update("heroDescription")}
            maxLength={500}
            rows={3}
          />
        </Field>

        <Field
          label="About paragraphs"
          htmlFor="profile-about"
          hint="Separate paragraphs with a blank line."
        >
          <TextArea
            id="profile-about"
            value={form.aboutParagraphs}
            onChange={update("aboutParagraphs")}
            rows={10}
          />
        </Field>

        <Field label="Contact blurb" htmlFor="profile-blurb" hint="Text beside the contact form.">
          <TextArea
            id="profile-blurb"
            value={form.contactBlurb}
            onChange={update("contactBlurb")}
            maxLength={500}
            rows={3}
          />
        </Field>

        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Public email" htmlFor="profile-email">
            <TextInput
              id="profile-email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="GitHub" htmlFor="profile-github">
            <TextInput
              id="profile-github"
              value={form.github}
              onChange={update("github")}
              placeholder="https://github.com/you"
            />
          </Field>
          <Field label="LinkedIn" htmlFor="profile-linkedin">
            <TextInput
              id="profile-linkedin"
              value={form.linkedin}
              onChange={update("linkedin")}
              placeholder="https://linkedin.com/in/you"
            />
          </Field>
        </div>

        <Button type="submit" loading={saving}>
          <Save size={16} /> Save profile
        </Button>
      </form>
    </div>
  );
};

export default ProfilePanel;
