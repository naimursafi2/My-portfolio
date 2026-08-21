import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";

/**
 * Wraps every /admin page except the login screen. While the stored token is
 * being verified nothing but a spinner renders, so dashboard content never
 * flashes on screen before a redirect.
 */
const ProtectedRoute = ({ children }) => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={28} />
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  if (status !== "signedIn") {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
