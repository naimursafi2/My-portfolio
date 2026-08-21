import { useEffect, useState } from "react";
import { Mail, MailOpen, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api.js";
import { PanelHeader, Button, ConfirmButton, EmptyState, Spinner } from "./ui.jsx";

const formatDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const MessagesPanel = () => {
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data, unread: unreadCount } = await api.getMessages();
      setMessages(data);
      setUnread(unreadCount);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (message) => {
    try {
      const { data } = await api.markMessageRead(message._id, !message.read);
      setMessages((prev) => prev.map((item) => (item._id === data._id ? data : item)));
      setUnread((prev) => prev + (data.read ? -1 : 1));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const remove = async (message) => {
    try {
      await api.deleteMessage(message._id);
      setMessages((prev) => prev.filter((item) => item._id !== message._id));
      if (!message.read) setUnread((prev) => Math.max(0, prev - 1));
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Messages"
        description={
          unread > 0
            ? `${unread} unread of ${messages.length} total.`
            : "Everything submitted through the contact form."
        }
        action={
          <Button variant="outline" onClick={load} loading={loading}>
            <RefreshCw size={14} /> Refresh
          </Button>
        }
      />

      {loading ? (
        <Spinner label="Loading messages" />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages yet"
          description="Contact form submissions will show up here."
        />
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <li
              key={message._id}
              className={`p-5 rounded-xl border transition-colors ${
                message.read ? "bg-card border-border" : "bg-primary/5 border-primary/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-medium flex items-center gap-2">
                    {message.name}
                    {!message.read && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        New
                      </span>
                    )}
                  </p>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {message.email}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDate(message.createdAt)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed mb-4">
                {message.message}
              </p>

              {message.emailError && (
                <p className="flex items-start gap-2 text-xs text-destructive mb-4">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  Email notification failed: {message.emailError}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => toggleRead(message)}>
                  {message.read ? <Mail size={14} /> : <MailOpen size={14} />}
                  {message.read ? "Mark unread" : "Mark read"}
                </Button>
                <a
                  href={`mailto:${message.email}?subject=Re: your message`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Reply
                </a>
                <ConfirmButton onConfirm={() => remove(message)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessagesPanel;
