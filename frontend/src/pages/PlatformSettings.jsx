import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentPlatformAdmin,
  updatePlatformAdminProfile,
} from "../services/platformAdminApi";
import "../PlatformSettings.css";

function PlatformSettings() {
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentAdmin = await getCurrentPlatformAdmin();

        setAdmin(currentAdmin);
        setName(currentAdmin.name);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (name.trim() === admin.name) {
      setError("No changes were made to your profile.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await updatePlatformAdminProfile({
        name: name.trim(),
      });

      setAdmin(response.admin);
      setName(response.admin.name);
      setSuccess(response.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="platform-settings">
        <p className="settings-loading">Loading your settings...</p>
      </main>
    );
  }

  return (
    <main className="platform-settings">
      <div className="settings-heading">
        <h1>Settings</h1>
        <p>Manage your NOVA platform administrator account.</p>
      </div>

      <section className="settings-section">
        <div className="settings-section-heading">
          <h2>Profile Information</h2>
          <p>Manage your personal account information.</p>
        </div>

        {error && <div className="settings-message error">{error}</div>}

        {success && <div className="settings-message success">{success}</div>}

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="settings-field">
            <label htmlFor="admin-name">Full Name</label>
            <input
              id="admin-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={3}
              maxLength={70}
              required
            />
          </div>

          <div className="settings-field">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              value={admin?.email || ""}
              readOnly
            />
            <small>Email changes require verification.</small>
          </div>

          <button
            type="submit"
            className="settings-save-button"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <Link to="/platform/dashboard" className="settings-back-link">
        Back to Dashboard
      </Link>
    </main>
  );
}

export default PlatformSettings;
