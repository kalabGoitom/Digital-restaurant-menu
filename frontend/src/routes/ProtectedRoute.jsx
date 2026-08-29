import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children }) {
  const { admin } = useAuth();
  if (!admin) {
    window.location.replace("/admin/login");
    return null;
  }
  return children;
}

export default ProtectedRoute;
