import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  logoutRestaurantAdmin,
  getCurrentRestaurantAdmin,
} from "../services/authApi.js";
import RestaurantBranding from "../components/RestaurantBranding.jsx";
import UpcomingMenus from "../components/UpcomingMenus.jsx";
import MenuHistory from "../components/MenuHistory.jsx";
import "../RestaurantDashboard.css";

function RestaurantDashboard() {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const currentAdmin = await getCurrentRestaurantAdmin();
        setAdmin(currentAdmin);
      } catch (error) {
        console.error("Failed to fetch restaurant admin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutRestaurantAdmin();
      navigate("/restaurant/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <main className="restaurant-dashboard">
      <header className="dashboard-header">
        <div>
          <RestaurantBranding restaurant={admin?.restaurant} />
          <h1>{isLoading ? "Loading..." : "Dashboard"}</h1>
        </div>

        <button onClick={handleLogout}>Log out</button>
      </header>

      <section className="dashboard-welcome">
        <h2>Welcome back{admin?.name ? `, ${admin.name}` : ""}!</h2>
        <p>Manage your menu items and decide what to serve today.</p>
      </section>

      <section className="dashboard-sections">
        <article className="dashboard-card">
          <h3>Menu Items</h3>
          <p>Add, edit, and manage your restaurant's dishes.</p>
          <button
            type="button"
            onClick={() => navigate("/restaurant/menu-items")}
          >
            Manage Menu
          </button>
        </article>

        <article className="dashboard-card">
          <h3>Today's Menu</h3>
          <p>Choose which dishes are available today.</p>
          <button
            type="button"
            onClick={() => navigate("/restaurant/daily-menu")}
          >
            Manage Today's Menu
          </button>
        </article>

        <article className="dashboard-card">
          <h3>Restaurant Settings</h3>
          <p>View and manage your restaurant information.</p>
          <button
            type="button"
            onClick={() => navigate("/restaurant/settings")}
          >
            Manage Settings
          </button>
        </article>
      </section>
      <UpcomingMenus />
      <MenuHistory />
    </main>
  );
}

export default RestaurantDashboard;
