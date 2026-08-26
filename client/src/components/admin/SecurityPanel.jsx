import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api.js";
import { PanelHeader, Field, TextInput, Button } from "./ui.jsx";

const EMPTY = { currentPassword: "", newPassword: "", confirmNewPassword: "" };

const SecurityPanel = () => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();

    if (!form.currentPassword) {
      toast.error("Enter your current password");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await api.changePassword(form);
      toast.success("Password changed");
      setForm(EMPTY);
    } catch (error) {
      toast.error(error.details?.[0]?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PanelHeader title="Security" description="Change the password used to sign in to this dashboard." />

      <form onSubmit={save} className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-md">
        <Field label="Current password" htmlFor="current-password">
          <TextInput
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={update("currentPassword")}
          />
        </Field>

        <Field label="New password" htmlFor="new-password" hint="At least 8 characters.">
          <TextInput
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={update("newPassword")}
          />
        </Field>

        <Field label="Confirm new password" htmlFor="confirm-new-password">
          <TextInput
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            value={form.confirmNewPassword}
            onChange={update("confirmNewPassword")}
          />
        </Field>

        <Button type="submit" loading={saving}>
          <KeyRound size={16} /> Change password
        </Button>
      </form>
    </div>
  );
};

export default SecurityPanel;
