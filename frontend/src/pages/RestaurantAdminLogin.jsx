import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRestaurantAdmin } from "../services/authApi.js";

function RestaurantAdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginRestaurantAdmin(formData);

      navigate("/restaurant/dashboard");
    } catch (error) {
      setError(error.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="restaurant-admin-login">
      <section className="restaurant-admin-login-card">
        <h1>Restaurant admin login</h1>
        <p>Sign in to manage your restaurant menu.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p>
          Don't have an account? You need a valid restaurant invitation to
          register.
        </p>
      </section>
    </main>
  );
}

export default RestaurantAdminLogin;
