import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * Wraps any route that requires the user to be logged in.
 * Checks both localStorage (remember me) and sessionStorage (session only).
 * If no token is found, redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("pms_token") ||
    sessionStorage.getItem("pms_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}