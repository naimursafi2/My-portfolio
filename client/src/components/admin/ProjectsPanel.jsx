import { useEffect, useRef, useState } from "react";
import { Folder, Plus, ArrowUp, ArrowDown, Pencil, Upload, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api.js";
import {
  PanelHeader,
  Field,
  TextInput,
  TextArea,
  Button,
  ConfirmButton,
  EmptyState,
  Spinner,
} from "./ui.jsx";

const EMPTY_FORM = {
  title: "",
  description: "",
  image: "",
  imagePublicId: "",
  tech: "",
  liveLink: "",
  githubLink: "",
};

const toForm = (project) => ({
  title: project.title || "",
  description: project.description || "",
  image: project.image || "",
  imagePublicId: project.imagePublicId || "",
  tech: (project.tech || []).join(", "),
  liveLink: project.liveLink || "",
  githubLink: project.githubLink || "",
});

const ProjectsPanel = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  // null when the form is closed, "new" when adding, otherwise the project id.
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);

  const load = async () => {
    try {
      const { data } = await api.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const startEdit = (project) => {
    setForm(toForm(project));
    setEditing(project._id);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await api.uploadImage(file);
      setForm((prev) => ({ ...prev, image: data.url, imagePublicId: data.publicId }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setSaving(true);
    try {
      if (editing === "new") {
        await api.createProject(form);
        toast.success("Project added");
      } else {
        await api.updateProject(editing, form);
        toast.success("Project updated");
      }
      closeForm();
      await load();
    } catch (error) {
      toast.error(error.details?.[0]?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (project) => {
    try {
      await api.deleteProject(project._id);
      setProjects((prev) => prev.filter((item) => item._id !== project._id));
      toast.success(`Deleted ${project.title}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;

    const reordered = [...projects];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setProjects(reordered);

    try {
      await api.reorderProjects(reordered.map((project) => project._id));
    } catch (error) {
      toast.error(error.message);
      load();
    }
  };

  return (
    <div>
      <PanelHeader
        title="Projects"
        description="Everything shown in the Projects section. Changes go live on the next page load."
        action={
          !editing && (
            <Button onClick={startNew}>
              <Plus size={16} /> New project
            </Button>
          )
        }
      />

      {editing && (
        <form onSubmit={save} className="rounded-xl border border-border bg-card p-6 mb-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg">
              {editing === "new" ? "New project" : "Edit project"}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          <Field label="Title" htmlFor="project-title">
            <TextInput
              id="project-title"
              value={form.title}
              onChange={update("title")}
              placeholder="Weather Dashboard"
              maxLength={120}
            />
          </Field>

          <Field label="Description" htmlFor="project-description">
            <TextArea
              id="project-description"
              value={form.description}
              onChange={update("description")}
              placeholder="What the project does and what you built it with."
              maxLength={1000}
              rows={3}
            />
          </Field>

          <Field
            label="Technologies"
            htmlFor="project-tech"
            hint="Separate with commas, e.g. React, Node.js, MongoDB"
          >
            <TextInput
              id="project-tech"
              value={form.tech}
              onChange={update("tech")}
              placeholder="React, Tailwind CSS"
            />
          </Field>

          <Field label="Image" hint="Upload a file, or paste an image URL below.">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center shrink-0">
                {form.image ? (
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-muted-foreground" />
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  loading={uploading}
                  onClick={() => fileInput.current?.click()}
                >
                  <Upload size={14} /> Upload
                </Button>
                {form.image && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setForm((prev) => ({ ...prev, image: "", imagePublicId: "" }))}
                  >
                    Clear
                  </Button>
                )}
              </div>

              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
          </Field>

          <Field label="Image URL" htmlFor="project-image">
            <TextInput
              id="project-image"
              value={form.image}
              onChange={update("image")}
              placeholder="https://res.cloudinary.com/..."
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Live link" htmlFor="project-live">
              <TextInput
                id="project-live"
                value={form.liveLink}
                onChange={update("liveLink")}
                placeholder="https://example.com"
              />
            </Field>
            <Field label="GitHub link" htmlFor="project-github">
              <TextInput
                id="project-github"
                value={form.githubLink}
                onChange={update("githubLink")}
                placeholder="https://github.com/you/repo"
              />
            </Field>
          </div>

          <div className="flex gap-3">
            <Button type="submit" loading={saving}>
              {editing === "new" ? "Add project" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <Spinner label="Loading projects" />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No projects yet"
          description="Add your first project to fill the Projects section."
        />
      ) : (
        <ul className="space-y-3">
          {projects.map((project, index) => (
            <li
              key={project._id}
              className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-card border border-border"
            >
              <div className="w-20 h-14 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center shrink-0">
                {project.image ? (
                  <img src={project.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={16} className="text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-[200px]">
                <p className="font-medium truncate">{project.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                  aria-label={`Move ${project.title} up`}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === projects.length - 1}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                  aria-label={`Move ${project.title} down`}
                >
                  <ArrowDown size={16} />
                </button>
                <Button variant="outline" onClick={() => startEdit(project)} className="!px-3">
                  <Pencil size={14} /> Edit
                </Button>
                <ConfirmButton onConfirm={() => remove(project)} className="!px-3" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPanel;
