import { useState } from "react";
import { loginPlatformAdmin } from "../services/authApi";
import { useNavigate, Link } from "react-router-dom";

function PlatformLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const data = await loginPlatformAdmin(formData);

      setMessage(data.message || "Login successful!");

      // Move to the dashboard after successful login.
      navigate("/platform/dashboard");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="platform-login">
      <h1>Platform Admin Login</h1>
      <p>Sign in to manage your NOVA platform.</p>

      {message && (
        <p role="status" style={{ color: "green" }}>
          {message}
        </p>
      )}
      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/platform/signup">Sign up</Link>
      </p>
    </main>
  );
}

export default PlatformLogin;
