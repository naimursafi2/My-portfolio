import { useState } from "react";
import { Loader2 } from "lucide-react";

export const PanelHeader = ({ title, description, action }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

export const Field = ({ label, hint, children, htmlFor }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-2 text-foreground">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
  </div>
);

const inputClasses =
  "w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

export const TextInput = (props) => <input {...props} className={inputClasses} />;

export const TextArea = (props) => (
  <textarea {...props} className={`${inputClasses} resize-y min-h-[90px]`} />
);

export const Button = ({ variant = "primary", loading, children, className = "", ...props }) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border text-foreground hover:bg-secondary",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  };

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
};

/**
 * Two-step delete. Avoids a blocking window.confirm and gives an easy way out.
 */
export const ConfirmButton = ({ onConfirm, label = "Delete", confirmLabel = "Sure?", ...props }) => {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <Button variant="outline" onClick={() => setArmed(true)} {...props}>
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex gap-2">
      <Button variant="danger" onClick={onConfirm} {...props}>
        {confirmLabel}
      </Button>
      <Button variant="outline" onClick={() => setArmed(false)}>
        Cancel
      </Button>
    </span>
  );
};

export const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="rounded-xl border border-dashed border-border p-12 text-center">
    {Icon && <Icon className="mx-auto mb-3 text-muted-foreground" size={28} />}
    <p className="font-medium text-foreground">{title}</p>
    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
  </div>
);

export const Spinner = ({ label = "Loading" }) => (
  <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
    <Loader2 className="animate-spin" size={18} /> {label}
  </div>
);
