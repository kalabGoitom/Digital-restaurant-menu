import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

const API_URL = "http://localhost:5000/api/admin";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setAdmin(null);
          sessionStorage.removeItem("nova-admin");
          return;
        }

        const data = await response.json();

        setAdmin(data.admin);
        sessionStorage.setItem("nova-admin", JSON.stringify(data.admin));
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAdmin(null);
        sessionStorage.removeItem("nova-admin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = (user) => {
    sessionStorage.setItem("nova-admin", JSON.stringify(user));
    setAdmin(user);
  };

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      sessionStorage.removeItem("nova-admin");
      setAdmin(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        admin,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
