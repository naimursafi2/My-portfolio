import { useEffect, useState } from "react";
import { LayoutDashboard, Code2, Folder, Mail, User, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import SkillsPanel from "@/components/admin/SkillsPanel.jsx";
import ProjectsPanel from "@/components/admin/ProjectsPanel.jsx";
import MessagesPanel from "@/components/admin/MessagesPanel.jsx";
import ProfilePanel from "@/components/admin/ProfilePanel.jsx";

const TABS = [
  { id: "projects", label: "Projects", icon: Folder, Panel: ProjectsPanel },
  { id: "skills", label: "Skills", icon: Code2, Panel: SkillsPanel },
  { id: "messages", label: "Messages", icon: Mail, Panel: MessagesPanel },
  { id: "profile", label: "Profile", icon: User, Panel: ProfilePanel },
];

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const [active, setActive] = useState(() => {
    try {
      return localStorage.getItem("portfolio_admin_tab") || "projects";
    } catch {
      return "projects";
    }
  });

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_admin_tab", active);
    } catch {
      /* storage disabled - the tab just will not be remembered */
    }
  }, [active]);

  const ActivePanel = TABS.find((tab) => tab.id === active)?.Panel ?? ProjectsPanel;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <LayoutDashboard className="text-primary shrink-0" size={20} />
            <div className="min-w-0">
              <h1 className="font-display font-bold leading-tight truncate">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground truncate">{admin?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
            >
              View site <ExternalLink size={14} />
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>

        <nav className="container mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                active === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ActivePanel />
      </main>
    </div>
  );
};

export default Dashboard;
