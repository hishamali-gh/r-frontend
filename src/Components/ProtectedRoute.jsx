import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn"); // or from context

  // if user is not logged in, redirect to login page
  if (!isLoggedIn || isLoggedIn === "false") {
    return <Navigate to="/login" replace />;
  }

  // otherwise, allow access
  return children;
}
