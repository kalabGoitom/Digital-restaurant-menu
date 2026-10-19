import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getRestaurantById,
  updateRestaurant,
  deactivateRestaurant,
  reactivateRestaurant,
} from "../services/platformAdminApi.js";

function PlatformRestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    defaultLanguage: "en",
  });

  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  const handleEditClick = () => {
    setFormData({
      name: restaurant.name ?? "",
      logoUrl: restaurant.logoUrl ?? "",
      primaryColor: restaurant.primaryColor ?? "",
      secondaryColor: restaurant.secondaryColor ?? "",
      accentColor: restaurant.accentColor ?? "",
      defaultLanguage: restaurant.defaultLanguage ?? "en",
    });

    setEditError("");
    setEditSuccess("");
    setIsEditing(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setEditError("");
    setEditSuccess("");

    // Send only the fields allowed by updateRestaurantSchema.
    const payload = {
      name: formData.name.trim(),
      logoUrl: formData.logoUrl.trim() || null,
      primaryColor: formData.primaryColor.trim() || null,
      secondaryColor: formData.secondaryColor.trim() || null,
      accentColor: formData.accentColor.trim() || null,
      defaultLanguage: formData.defaultLanguage.trim(),
    };

    try {
      const updatedRestaurant = await updateRestaurant(restaurant.id, payload);

      setRestaurant((current) => ({
        ...current,
        ...updatedRestaurant,
      }));

      setEditSuccess("Restaurant updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setEditError(error.message || "Failed to update restaurant.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleDeactivate = async () => {
    setStatusLoading(true);
    setStatusError("");
    setStatusSuccess("");

    try {
      const updatedRestaurant = await deactivateRestaurant(restaurant.id);

      setRestaurant((current) => ({
        ...current,
        ...updatedRestaurant,
      }));

      setStatusSuccess("Restaurant deactivated successfully.");
    } catch (error) {
      setStatusError(error.message || "Failed to deactivate restaurant.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleReactivate = async () => {
    setStatusLoading(true);
    setStatusError("");
    setStatusSuccess("");

    try {
      const updatedRestaurant = await reactivateRestaurant(restaurant.id);

      setRestaurant((current) => ({
        ...current,
        ...updatedRestaurant,
      }));

      setStatusSuccess("Restaurant reactivated successfully.");
    } catch (error) {
      setStatusError(error.message || "Failed to reactivate restaurant.");
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        setError(error.message || "Failed to load restaurant.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <main className="platform-restaurants">Loading restaurant...</main>;
  }

  if (error) {
    return (
      <main className="platform-restaurants">
        <p className="restaurants-error" role="alert">
          {error}
        </p>
        <Link to="/platform/restaurants">Back to Restaurants</Link>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="platform-restaurants">
        <p>Restaurant not found.</p>
        <Link to="/platform/restaurants">Back to Restaurants</Link>
      </main>
    );
  }

  return (
    <main className="platform-restaurants">
      <div className="restaurants-header restaurant-details-header">
        <div className="restaurants-heading">
          <h1>{restaurant.name}</h1>
          <p>Restaurant details and account status.</p>
        </div>

        <Link className="back-to-restaurants" to="/platform/restaurants">
          ← Back to Restaurants
        </Link>
      </div>

      <section className="create-restaurant-form restaurant-details-card">
        {!isEditing ? (
          <>
            <h2 className="details-section-title">Restaurant Information</h2>
            <div className="invitation-field">
              <label>Restaurant name</label>
              <strong>{restaurant.name}</strong>
            </div>
            <div className="invitation-field">
              <label>Slug</label>
              <strong>{restaurant.slug}</strong>
            </div>
            <div className="invitation-field">
              <label>Status</label>
              <strong
                className={`restaurant-status-badge ${
                  restaurant.isActive ? "active" : "inactive"
                }`}
              >
                {restaurant.isActive ? "Active" : "Inactive"}
              </strong>
            </div>
            <div className="invitation-field">
              <label>Default language</label>
              <strong>{restaurant.defaultLanguage || "en"}</strong>
            </div>
            <div className="invitation-field">
              <label>Logo URL</label>
              <strong>{restaurant.logoUrl || "Not set"}</strong>
            </div>
            <div className="invitation-field">
              <label>Primary color</label>
              <strong>{restaurant.primaryColor || "Not set"}</strong>
            </div>
            <div className="invitation-field">
              <label>Secondary color</label>
              <strong>{restaurant.secondaryColor || "Not set"}</strong>
            </div>
            <div className="invitation-field">
              <label>Accent color</label>
              <strong>{restaurant.accentColor || "Not set"}</strong>
            </div>
            <div className="invitation-field">
              <label>Created</label>
              <strong>{new Date(restaurant.createdAt).toLocaleString()}</strong>
            </div>
            <button type="button" onClick={handleEditClick}>
              Edit Restaurant
            </button>

            <div className="restaurant-status-actions">
              {statusError && <p className="error-message">{statusError}</p>}
              {statusSuccess && <p>{statusSuccess}</p>}

              {restaurant.isActive ? (
                <button
                  type="button"
                  onClick={handleDeactivate}
                  disabled={statusLoading}
                  className="deactivate-button"
                >
                  {statusLoading ? "Please wait..." : "Deactivate Restaurant"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReactivate}
                  disabled={statusLoading}
                  className="reactivate-button"
                >
                  {statusLoading ? "Please wait..." : "Reactivate Restaurant"}
                </button>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleEditSubmit} className="restaurant-edit-form">
            <h2>Edit Restaurant</h2>

            <label htmlFor="edit-name">Restaurant name</label>
            <input
              id="edit-name"
              name="name"
              type="text"
              minLength={2}
              maxLength={100}
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="edit-logoUrl">Logo URL</label>
            <input
              id="edit-logoUrl"
              name="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
            />

            <label htmlFor="edit-primaryColor">Primary color</label>
            <input
              id="edit-primaryColor"
              name="primaryColor"
              type="text"
              value={formData.primaryColor}
              onChange={handleInputChange}
              placeholder="#4F46E5"
            />

            <label htmlFor="edit-secondaryColor">Secondary color</label>
            <input
              id="edit-secondaryColor"
              name="secondaryColor"
              type="text"
              value={formData.secondaryColor}
              onChange={handleInputChange}
              placeholder="#111827"
            />

            <label htmlFor="edit-accentColor">Accent color</label>
            <input
              id="edit-accentColor"
              name="accentColor"
              type="text"
              value={formData.accentColor}
              onChange={handleInputChange}
              placeholder="#F59E0B"
            />

            <label htmlFor="edit-defaultLanguage">Default language</label>
            <input
              id="edit-defaultLanguage"
              name="defaultLanguage"
              type="text"
              minLength={2}
              maxLength={10}
              value={formData.defaultLanguage}
              onChange={handleInputChange}
              placeholder="en"
              required
            />

            {editError && (
              <p className="create-restaurant-error" role="alert">
                {editError}
              </p>
            )}

            {editSuccess && <p role="status">{editSuccess}</p>}

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setIsEditing(false);
                setEditError("");
                setEditSuccess("");
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default PlatformRestaurantDetails;
