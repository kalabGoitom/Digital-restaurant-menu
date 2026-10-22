import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRestaurantSettings,
  updateRestaurantSettings,
} from "../services/restaurantSettingsApi";
import "../RestaurantDashboard.css";
import "../RestaurantSettings.css";

function RestaurantSettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const {
        name,
        logoUrl,
        primaryColor,
        secondaryColor,
        accentColor,
        defaultLanguage,
      } = settings;

      const updatedRestaurant = await updateRestaurantSettings({
        name,
        logoUrl: logoUrl || null,
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        accentColor: accentColor || null,
        defaultLanguage,
      });
      setSettings(updatedRestaurant);
      alert("Restaurant settings saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save restaurant settings.");
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
          <label htmlFor="restaurant-logo">Logo URL</label>
          <input
            id="restaurant-logo"
            name="logoUrl"
            type="url"
            value={settings.logoUrl || ""}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
          <small>Leave empty if your restaurant has no logo.</small>
        </div>

        {settings.logoUrl && (
          <div className="settings-logo-preview">
            <img
              src={settings.logoUrl}
              alt="Restaurant logo preview"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
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

        <button className="settings-save-button" type="submit">
          Save Settings
        </button>
      </form>
    </main>
  );
}

export default RestaurantSettings;
