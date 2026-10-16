import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentPlatformAdmin,
  logoutPlatformAdmin,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // When the app first opens, ask the backend: "who is this?"
  useEffect(() => {
    getCurrentPlatformAdmin()
      .then((data) => setAdmin(data.admin || data)) // adjust to your backend's response shape
      .catch(() => setAdmin(null))
      .finally(() => setIsCheckingAuth(false));
  }, []);

  const logout = async () => {
    await logoutPlatformAdmin();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, setAdmin, isCheckingAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
