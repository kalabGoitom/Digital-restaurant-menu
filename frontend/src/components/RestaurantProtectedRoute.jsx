import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentRestaurantAdmin } from "../services/authApi.js";

function RestaurantProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await getCurrentRestaurantAdmin();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return <p>Checking restaurant admin authentication...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/restaurant/login" replace />;
  }

  return <Outlet />;
}

export default RestaurantProtectedRoute;
