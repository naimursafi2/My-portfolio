const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const TOKEN_KEY = "portfolio_admin_token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage disabled - the session just will not persist */
  }
};

/** Fired when the API rejects our token, so the app can log out and redirect. */
const UNAUTHORIZED_EVENT = "portfolio:unauthorized";
export const onUnauthorized = (handler) => {
  window.addEventListener(UNAUTHORIZED_EVENT, handler);
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const request = async (path, { method = "GET", body, auth = false, isFormData = false } = {}) => {
  const headers = {};
  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  const payload = await response.json().catch(() => ({}));

  if (response.status === 401 && auth) {
    setToken("");
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }

  if (!response.ok) {
    throw new ApiError(payload.message || `Request failed (${response.status})`, response.status, payload.details);
  }

  return payload;
};

export const api = {
  // --- public ---
  getSkills: () => request("/skills"),
  getProjects: () => request("/projects"),
  getProfile: () => request("/profile"),
  sendMessage: (body) => request("/contact", { method: "POST", body }),

  // --- auth ---
  login: (body) => request("/auth/login", { method: "POST", body }),
  me: () => request("/auth/me", { auth: true }),

  // --- admin: skills ---
  createSkill: (body) => request("/skills", { method: "POST", body, auth: true }),
  updateSkill: (id, body) => request(`/skills/${id}`, { method: "PUT", body, auth: true }),
  deleteSkill: (id) => request(`/skills/${id}`, { method: "DELETE", auth: true }),
  reorderSkills: (ids) => request("/skills/reorder", { method: "PATCH", body: { ids }, auth: true }),

  // --- admin: projects ---
  createProject: (body) => request("/projects", { method: "POST", body, auth: true }),
  updateProject: (id, body) => request(`/projects/${id}`, { method: "PUT", body, auth: true }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE", auth: true }),
  reorderProjects: (ids) => request("/projects/reorder", { method: "PATCH", body: { ids }, auth: true }),

  // --- admin: messages ---
  getMessages: () => request("/contact", { auth: true }),
  markMessageRead: (id, read = true) =>
    request(`/contact/${id}/read`, { method: "PATCH", body: { read }, auth: true }),
  deleteMessage: (id) => request(`/contact/${id}`, { method: "DELETE", auth: true }),

  // --- admin: profile ---
  updateProfile: (body) => request("/profile", { method: "PUT", body, auth: true }),

  // --- admin: uploads ---
  uploadImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return request("/upload", { method: "POST", body: form, auth: true, isFormData: true });
  },
};
