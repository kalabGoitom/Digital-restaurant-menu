import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentRestaurantAdmin } from "../services/authApi.js";
import RestaurantBranding from "../components/RestaurantBranding.jsx";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuApi.js";
import MenuItemForm from "../components/MenuItemForm.jsx";
import "../MenuManagement.css";

function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingFeaturedId, setUpdatingFeaturedId] = useState(null);

  const navigate = useNavigate();

  const fetchMenuItems = async () => {
    setError("");

    try {
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      setError(error.message || "Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleCreateMenuItem = async (formData) => {
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      await createMenuItem(formData);
      await fetchMenuItems();
      setShowForm(false);
      setMessage("Menu item created successfully.");
    } catch (error) {
      setError(error.message || "Failed to create menu item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMenuItem = async (formData) => {
    if (!editingItem) return;

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      await updateMenuItem(editingItem.id, formData);

      setEditingItem(null);
      setShowForm(false);
      setMessage("Menu item updated successfully.");

      await fetchMenuItems();
    } catch (error) {
      setError(error.message || "Failed to update menu item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setDeletingId(item.id);

    try {
      await deleteMenuItem(item.id);

      setMenuItems((previousItems) =>
        previousItems.filter((menuItem) => menuItem.id !== item.id),
      );

      setMessage(`"${item.name}" was deleted successfully.`);
    } catch (error) {
      setError(error.message || "Failed to delete menu item.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailability = async (item) => {
    setError("");
    setMessage("");

    try {
      await updateMenuItem(item.id, {
        available: !item.available,
      });

      setMenuItems((previousItems) =>
        previousItems.map((menuItem) =>
          menuItem.id === item.id
            ? { ...menuItem, available: !item.available }
            : menuItem,
        ),
      );

      setMessage(
        `${item.name} is now ${item.available ? "unavailable" : "available"}.`,
      );
    } catch (error) {
      setError(error.message || "Failed to update item availability.");
    }
  };

  const handleToggleFeatured = async (item) => {
    setError("");
    setMessage("");
    setUpdatingFeaturedId(item.id);

    try {
      const featured = !item.featured;

      await updateMenuItem(item.id, { featured });

      setMenuItems((previousItems) =>
        previousItems.map((menuItem) =>
          menuItem.id === item.id ? { ...menuItem, featured } : menuItem,
        ),
      );

      setMessage(
        featured
          ? `${item.name} is now a featured dish.`
          : `${item.name} is no longer featured.`,
      );
    } catch (error) {
      setError(error.message || "Failed to update featured status.");
    } finally {
      setUpdatingFeaturedId(null);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const admin = await getCurrentRestaurantAdmin();
        setRestaurant(admin?.restaurant || null);
      } catch (error) {
        console.error("Failed to load restaurant branding:", error);
      }
    };

    fetchRestaurant();
  }, []);

  return (
    <main className="menu-management">
      <header className="menu-management-header">
        <div>
          <RestaurantBranding restaurant={restaurant} />

          <button
            type="button"
            className="menu-back-button"
            onClick={() => navigate("/restaurant/dashboard")}
          >
            <span aria-hidden="true">←</span>
            Back to Dashboard
          </button>

          <h1>Menu Items</h1>
          <p>Manage the food and drinks offered by your restaurant.</p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="menu-button menu-button-primary"
            onClick={() => {
              setError("");
              setMessage("");
              setShowForm(true);
            }}
          >
            + Add menu item
          </button>
        )}
      </header>

      {error && (
        <p className="menu-feedback menu-feedback-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="menu-feedback menu-feedback-success" role="status">
          {message}
        </p>
      )}

      {showForm && (
        <section className="menu-form-card">
          <MenuItemForm
            key={editingItem?.id || "new-menu-item"}
            initialData={editingItem}
            onSubmit={editingItem ? handleUpdateMenuItem : handleCreateMenuItem}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
              setError("");
            }}
            submitting={submitting}
          />
        </section>
      )}

      {loading ? (
        <p>Loading menu items...</p>
      ) : menuItems.length === 0 ? (
        <section className="menu-empty-state">
          <h2>Your menu is empty</h2>
          <p>
            Add your first food or drink item to start building your restaurant
            menu.
          </p>

          {!showForm && (
            <button
              type="button"
              className="menu-button menu-button-primary"
              onClick={() => setShowForm(true)}
            >
              Add your first item
            </button>
          )}
        </section>
      ) : (
        <section className="menu-items-grid">
          {menuItems.map((item) => (
            <article className="menu-item-card" key={item.id}>
              {item.imageUrl ? (
                <img
                  className="menu-item-image"
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                />
              ) : (
                <div className="menu-item-image-placeholder">
                  No image available
                </div>
              )}

              <div className="menu-item-content">
                <div className="menu-item-title-row">
                  <h2>{item.name}</h2>

                  {item.featured && (
                    <span className="menu-featured-badge">★ Featured</span>
                  )}
                </div>

                <p className="menu-item-description">{item.description}</p>

                <div className="menu-item-meta">
                  <span className="menu-item-price">
                    {Number(item.price).toFixed(2)}
                  </span>
                  <span className="menu-item-category">{item.category}</span>
                </div>

                <span
                  className={`menu-item-status ${
                    item.available
                      ? "menu-item-status-available"
                      : "menu-item-status-unavailable"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>

                <div className="menu-item-actions">
                  <button
                    type="button"
                    className={`menu-featured-button ${
                      item.featured ? "is-featured" : ""
                    }`}
                    onClick={() => handleToggleFeatured(item)}
                    disabled={updatingFeaturedId === item.id}
                    aria-pressed={Boolean(item.featured)}
                    title={
                      item.featured
                        ? "Remove from featured dishes"
                        : "Mark as featured"
                    }
                  >
                    {updatingFeaturedId === item.id
                      ? "Updating..."
                      : item.featured
                        ? "★ Featured"
                        : "☆ Feature dish"}
                  </button>

                  <button
                    type="button"
                    className="menu-button menu-button-secondary"
                    onClick={() => {
                      setError("");
                      setMessage("");
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                  >
                    Edit item
                  </button>

                  <button
                    type="button"
                    className="menu-button menu-button-danger"
                    onClick={() => handleDeleteMenuItem(item)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>

                  <button
                    type="button"
                    className={`menu-icon-button ${
                      item.available
                        ? "menu-icon-button-unavailable"
                        : "menu-icon-button-available"
                    }`}
                    onClick={() => handleToggleAvailability(item)}
                    title={
                      item.available ? "Mark unavailable" : "Mark available"
                    }
                    aria-label={
                      item.available ? "Mark unavailable" : "Mark available"
                    }
                  >
                    {item.available ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M15 9l-6 6" />
                        <path d="M9 9l6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MenuItems;
