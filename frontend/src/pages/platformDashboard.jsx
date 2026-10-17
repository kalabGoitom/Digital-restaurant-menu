import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPlatformDashboardStats,
  getRecentRestaurants,
} from "../services/platformAdminApi";

function PlatformDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRestaurants: 0,
    activeRestaurants: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPlatformDashboardStats();
        setStats(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRecentRestaurants();
        setRestaurants(data);
      } catch (error) {
        setRestaurantsError(error.message);
      } finally {
        setRestaurantsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo">NOVA</h2>

        <p className="sidebar-label">PLATFORM</p>

        <nav className="sidebar-nav">
          <a href="/platform/dashboard" className="active">
            Overview
          </a>

          <a href="/platform/restaurants">Restaurants</a>

          <a href="/platform/settings">Settings</a>
        </nav>

        <button className="logout-button" type="button">
          Log out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Overview</h1>
            <p>Welcome back to NOVA.</p>
          </div>

          <div className="admin-avatar">A</div>
        </header>

        <section className="stats-grid">
          {error && <p role="alert">{error}</p>}
          <article className="stat-card">
            <p>Total restaurants</p>
            <h2>
              {isLoading ? "Loading..." : error ? "—" : stats.totalRestaurants}
            </h2>
          </article>

          <article className="stat-card">
            <p>Active restaurants</p>
            <h2>
              {isLoading ? "Loading..." : error ? "—" : stats.activeRestaurants}
            </h2>
          </article>
        </section>

        <section className="recent-section">
          <div className="section-heading">
            <h2>Recent restaurants</h2>
            <button
              type="button"
              onClick={() => navigate("/platform/restaurants")}
            >
              View all
            </button>
          </div>

          {restaurantsLoading ? (
            <p>Loading restaurants...</p>
          ) : restaurantsError ? (
            <p role="alert">{restaurantsError}</p>
          ) : restaurants.length === 0 ? (
            <p className="empty-state">
              No restaurants have been registered yet.
            </p>
          ) : (
            <div className="restaurant-list">
              {restaurants.map((restaurant) => (
                <article className="restaurant-item" key={restaurant.id}>
                  <div>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.slug}</p>
                  </div>

                  <span
                    className={
                      restaurant.isActive ? "status-active" : "status-inactive"
                    }
                  >
                    {restaurant.isActive ? "Active" : "Inactive"}
                  </span>

                  <time dateTime={restaurant.createdAt}>
                    {new Date(restaurant.createdAt).toLocaleDateString()}
                  </time>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PlatformDashboard;
