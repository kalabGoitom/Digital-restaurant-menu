import { useAuth } from "../context/useAuth.js";

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!admin) {
    window.location.replace("/admin/login");
    return null;
  }

  return children;
}

export default ProtectedRoute;
