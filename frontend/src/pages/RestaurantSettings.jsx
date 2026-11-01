import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRestaurantSettings,
  updateRestaurantSettings,
} from "../services/restaurantSettingsApi";
import { uploadImage } from "../services/menuApi.js";

import "../RestaurantDashboard.css";
import "../RestaurantSettings.css";

function RestaurantSettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const restaurant = await getRestaurantSettings();
        setSettings(restaurant);
      } catch (err) {
        setError(err.message || "Failed to load restaurant settings.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Logo image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setLogoPreview(localPreview);
    setIsUploading(true);

    try {
      const result = await uploadImage(file, "logo");

      setSettings((current) => ({
        ...current,
        logoUrl: result.url,
        logoPublicId: result.publicId,
      }));
    } catch (err) {
      setLogoPreview("");
      setError(err.message || "Failed to upload restaurant logo.");
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
      event.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setSettings((current) => ({
      ...current,
      logoUrl: null,
      logoPublicId: null,
    }));

    setLogoPreview("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const {
        name,
        logoUrl,
        logoPublicId,
        primaryColor,
        secondaryColor,
        accentColor,
        defaultLanguage,
      } = settings;

      const updatedRestaurant = await updateRestaurantSettings({
        name,
        logoUrl: logoUrl || null,
        logoPublicId: logoPublicId || null,
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        accentColor: accentColor || null,
        defaultLanguage,
      });

      setSettings(updatedRestaurant);
      setLogoPreview("");
      alert("Restaurant settings saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save restaurant settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="restaurant-settings">Loading settings...</div>;
  }

  if (!settings) {
    return (
      <div className="restaurant-settings">
        <p className="settings-error">
          {error || "Restaurant settings could not be loaded."}
        </p>
      </div>
    );
  }

  return (
    <main className="restaurant-settings">
      <header className="settings-header">
        <button
          type="button"
          className="settings-back-button"
          onClick={() => navigate("/restaurant/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div>
          <p className="settings-eyebrow">RESTAURANT MANAGEMENT</p>
          <h1>Restaurant Settings</h1>
          <p>Manage your restaurant's information and appearance.</p>
        </div>
      </header>

      {error && <p className="settings-error">{error}</p>}

      <form className="settings-card" onSubmit={handleSubmit}>
        <h2>Basic information</h2>

        <div className="settings-field">
          <label htmlFor="restaurant-name">Restaurant name</label>
          <input
            id="restaurant-name"
            name="name"
            value={settings.name || ""}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />
        </div>

        <div className="settings-field">
          <label htmlFor="restaurant-slug">Public menu URL slug</label>
          <input id="restaurant-slug" value={settings.slug || ""} readOnly />
          <small>The slug cannot be changed here.</small>
        </div>

        <div className="settings-field">
          <label htmlFor="restaurant-logo">Restaurant logo</label>

          <input
            id="restaurant-logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            disabled={isUploading || isSaving}
          />

          <small>
            Choose an image for your restaurant logo. Maximum size: 5 MB.
          </small>
        </div>

        {(logoPreview || settings.logoUrl) && (
          <div className="settings-logo-section">
            <div className="settings-logo-preview">
              <img
                src={logoPreview || settings.logoUrl}
                alt="Restaurant logo preview"
              />
            </div>

            <button
              type="button"
              className="settings-remove-logo"
              onClick={handleRemoveLogo}
              disabled={isUploading || isSaving}
            >
              Remove logo
            </button>
          </div>
        )}

        {isUploading && (
          <p className="settings-upload-status">
            Uploading logo to Cloudinary...
          </p>
        )}

        <h2>Brand colors</h2>

        {[
          ["primaryColor", "Primary color"],
          ["secondaryColor", "Secondary color"],
          ["accentColor", "Accent color"],
        ].map(([name, label]) => (
          <div className="settings-field" key={name}>
            <label htmlFor={name}>{label}</label>

            <div className="settings-color-input">
              <input
                id={name}
                name={name}
                type="color"
                value={settings[name] || "#2563eb"}
                onChange={handleChange}
              />

              <span>{settings[name] || "#2563eb"}</span>

              <button
                type="button"
                className="settings-clear-color"
                onClick={() =>
                  setSettings((current) => ({
                    ...current,
                    [name]: "",
                  }))
                }
              >
                Clear
              </button>
            </div>
          </div>
        ))}

        <h2>Language</h2>

        <div className="settings-field">
          <label htmlFor="default-language">Default menu language</label>

          <select
            id="default-language"
            name="defaultLanguage"
            value={settings.defaultLanguage || "en"}
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="am">Amharic</option>
          </select>
        </div>

        <button
          className="settings-save-button"
          type="submit"
          disabled={isUploading || isSaving}
        >
          {isSaving ? "Saving settings..." : "Save Settings"}
        </button>
      </form>
    </main>
  );
}

export default RestaurantSettings;
