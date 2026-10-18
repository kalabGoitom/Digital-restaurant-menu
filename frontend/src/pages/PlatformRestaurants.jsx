import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllRestaurants,
  createRestaurant,
} from "../services/platformAdminApi.js";

function PlatformRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [invitation, setInvitation] = useState(null);

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

  const handleCreateRestaurant = async (event) => {
    event.preventDefault();

    setCreating(true);
    setCreateError("");
    setInvitation(null);

    try {
      const data = await createRestaurant({
        name: restaurantName.trim(),
        ownerEmail: ownerEmail.trim(),
      });

      setInvitation(data.invitation);
      setRestaurantName("");
      setOwnerEmail("");

      // Refresh the restaurant list.
      const updatedRestaurants = await getAllRestaurants();
      setRestaurants(updatedRestaurants);
    } catch (error) {
      setCreateError(error.message || "Failed to create restaurant.");
    } finally {
      setCreating(false);
    }
  };

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

        <div className="restaurants-header-actions">
          <span className="restaurants-count">
            {restaurants.length} restaurants
          </span>

          <button
            type="button"
            className="create-restaurant-button"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setCreateError("");
              setInvitation(null);
            }}
          >
            {showCreateForm ? "Cancel" : "+ Create Restaurant"}
          </button>
        </div>
      </div>
      {showCreateForm && (
        <form
          className="create-restaurant-form"
          onSubmit={handleCreateRestaurant}
        >
          <h2>Create a restaurant</h2>
          <p>Add a restaurant and invite its owner to create an account.</p>

          <label htmlFor="restaurantName">Restaurant name</label>
          <input
            id="restaurantName"
            type="text"
            value={restaurantName}
            onChange={(event) => setRestaurantName(event.target.value)}
            placeholder="e.g. Habesha Restaurant"
            required
          />

          <label htmlFor="ownerEmail">Owner email</label>
          <input
            id="ownerEmail"
            type="email"
            value={ownerEmail}
            onChange={(event) => setOwnerEmail(event.target.value)}
            placeholder="owner@example.com"
            required
          />

          {createError && (
            <p className="create-restaurant-error" role="alert">
              {createError}
            </p>
          )}

          <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Restaurant"}
          </button>
        </form>
      )}

      {invitation && (
        <section className="restaurant-invitation">
          <h2>Restaurant created successfully!</h2>

          <p>Share these invitation details with the restaurant owner.</p>

          <div className="invitation-field">
            <label>Signup link</label>
            <a href={invitation.link}>{invitation.link}</a>
          </div>

          <div className="invitation-field">
            <label>Invitation code</label>
            <strong>{invitation.code}</strong>
          </div>

          <p className="invitation-expiry">
            Expires: {new Date(invitation.expiresAt).toLocaleString()}
          </p>
        </section>
      )}

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
                <h2>
                  <Link to={`/platform/restaurants/${restaurant.id}`}>
                    {restaurant.name}
                  </Link>
                </h2>
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
