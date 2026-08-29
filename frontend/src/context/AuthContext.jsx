import { useState } from "react";
import { AuthContext } from "./authContext";
const storageKey = "nova-admin";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = sessionStorage.getItem(storageKey);
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const signIn = (user) => {
    sessionStorage.setItem(storageKey, JSON.stringify(user));
    setAdmin(user);
  };
  const signOut = () => {
    sessionStorage.removeItem(storageKey);
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, signIn, signOut }}>{children}</AuthContext.Provider>;
}
