import { useEffect, useState } from "react";
import { Code2, Plus, ArrowUp, ArrowDown, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api.js";
import { PanelHeader, TextInput, Button, ConfirmButton, EmptyState, Spinner } from "./ui.jsx";

const SkillsPanel = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const load = async () => {
    try {
      const { data } = await api.getSkills();
      setSkills(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    const name = newSkill.trim();
    if (!name) return;

    setSaving(true);
    try {
      const { data } = await api.createSkill({ name });
      setSkills((prev) => [...prev, data]);
      setNewSkill("");
      toast.success(`Added ${data.name}`);
    } catch (error) {
      toast.error(error.details?.[0]?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (id) => {
    const name = editingName.trim();
    if (!name) return;

    try {
      const { data } = await api.updateSkill(id, { name });
      setSkills((prev) => prev.map((skill) => (skill._id === id ? data : skill)));
      setEditingId(null);
      toast.success("Skill updated");
    } catch (error) {
      toast.error(error.details?.[0]?.message || error.message);
    }
  };

  const remove = async (skill) => {
    try {
      await api.deleteSkill(skill._id);
      setSkills((prev) => prev.filter((item) => item._id !== skill._id));
      toast.success(`Removed ${skill.name}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= skills.length) return;

    const reordered = [...skills];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setSkills(reordered);

    try {
      await api.reorderSkills(reordered.map((skill) => skill._id));
    } catch (error) {
      toast.error(error.message);
      load();
    }
  };

  return (
    <div>
      <PanelHeader
        title="Skills"
        description="These appear in the Skills section. No percentages, just what you work with."
      />

      <form onSubmit={add} className="flex flex-wrap gap-3 mb-8">
        <TextInput
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill, e.g. Docker"
          maxLength={60}
        />
        <Button type="submit" loading={saving} className="shrink-0">
          <Plus size={16} /> Add skill
        </Button>
      </form>

      {loading ? (
        <Spinner label="Loading skills" />
      ) : skills.length === 0 ? (
        <EmptyState icon={Code2} title="No skills yet" description="Add your first skill above." />
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {skills.map((skill, index) => (
            <li
              key={skill._id}
              className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border"
            >
              {editingId === skill._id ? (
                <>
                  <TextInput
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    maxLength={60}
                    autoFocus
                  />
                  <Button variant="primary" onClick={() => saveEdit(skill._id)} aria-label="Save">
                    <Check size={14} />
                  </Button>
                  <Button variant="outline" onClick={() => setEditingId(null)} aria-label="Cancel">
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium truncate">{skill.name}</span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                      aria-label={`Move ${skill.name} up`}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === skills.length - 1}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                      aria-label={`Move ${skill.name} down`}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(skill._id);
                        setEditingName(skill.name);
                      }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`Edit ${skill.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <ConfirmButton
                      onConfirm={() => remove(skill)}
                      label="Delete"
                      className="!px-3 !py-1.5"
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SkillsPanel;
