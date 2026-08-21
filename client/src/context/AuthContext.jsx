import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api, getToken, setToken, onUnauthorized } from "@/lib/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  // "checking" until the stored token has been validated against the server.
  const [status, setStatus] = useState("checking");

  const logout = useCallback(() => {
    setToken("");
    setAdmin(null);
    setStatus("signedOut");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!getToken()) {
        setStatus("signedOut");
        return;
      }
      try {
        const { admin: account } = await api.me();
        if (cancelled) return;
        setAdmin(account);
        setStatus("signedIn");
      } catch {
        if (!cancelled) logout();
      }
    };

    verify();
    // Any 401 from anywhere in the app ends the session immediately.
    const off = onUnauthorized(logout);
    return () => {
      cancelled = true;
      off();
    };
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { token, admin: account } = await api.login({ email, password });
    setToken(token);
    setAdmin(account);
    setStatus("signedIn");
    return account;
  }, []);

  const value = useMemo(
    () => ({ admin, status, isAuthenticated: status === "signedIn", login, logout }),
    [admin, status, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
};
