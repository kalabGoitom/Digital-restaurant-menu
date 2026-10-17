import { useEffect, useState } from "react";
import { getAllRestaurants } from "../services/platformAdminApi.js";

function PlatformRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        setError(error.message || "Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      restaurant.name.toLowerCase().includes(search) ||
      restaurant.slug.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && restaurant.isActive) ||
      (statusFilter === "inactive" && !restaurant.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="platform-restaurants">
      <div className="restaurants-header">
        <div className="restaurants-heading">
          <h1>Restaurants</h1>
          <p>Manage and monitor all restaurants on NOVA.</p>
        </div>

        <span className="restaurants-count">
          {restaurants.length} restaurants
        </span>
      </div>
      <div className="restaurants-toolbar">
        <div className="restaurants-search">
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search restaurants"
          />
        </div>

        <select
          className="restaurants-status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter restaurants by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <p className="restaurants-message">Loading restaurants...</p>
      ) : error ? (
        <p className="restaurants-message restaurants-error" role="alert">
          {error}
        </p>
      ) : filteredRestaurants.length === 0 ? (
        <p className="restaurants-message">
          {searchTerm
            ? "No restaurants match your search."
            : "No restaurants have been registered yet."}
        </p>
      ) : (
        <div className="restaurants-list">
          {filteredRestaurants.map((restaurant) => (
            <article className="restaurant-card" key={restaurant.id}>
              <div className="restaurant-info">
                <h2>{restaurant.name}</h2>
                <p>{restaurant.slug}</p>
              </div>

              <span
                className={`restaurant-status ${
                  restaurant.isActive ? "active" : "inactive"
                }`}
              >
                {restaurant.isActive ? "Active" : "Inactive"}
              </span>

              <time className="restaurant-date" dateTime={restaurant.createdAt}>
                {new Date(restaurant.createdAt).toLocaleDateString()}
              </time>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default PlatformRestaurants;
