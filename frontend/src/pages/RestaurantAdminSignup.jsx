import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { signupRestaurantAdmin } from "../services/authApi.js";

function RestaurantAdminSignup() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  console.log("Current URL:", window.location.href);
  console.log("Invitation token:", searchParams.get("token"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: "",
  });

  const [error, setError] = useState("");

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

    if (!token) {
      setError("Your invitation link is missing its token.");
      return;
    }

    try {
      const response = await signupRestaurantAdmin({
        ...formData,
        token,
      });

      navigate(
        `/restaurant/verify-email?email=${encodeURIComponent(response.admin.email)}`,
      );

      // We'll add navigation to email verification in the next step.
    } catch (error) {
      setError(error.message || "Unable to create your account.");
    }
  };

  return (
    <main className="restaurant-admin-signup">
      <section className="restaurant-admin-signup-card">
        <h1>Create your restaurant admin account</h1>
        <p>Use the details provided with your NOVA invitation.</p>

        {!token && (
          <p className="error-message" role="alert">
            This invitation link is missing its token. Please open the complete
            link from your invitation email.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Invited email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="inviteCode">Invitation code</label>
          <input
            id="inviteCode"
            name="inviteCode"
            type="text"
            autoComplete="one-time-code"
            value={formData.inviteCode}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Create password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={!token}>
            Create account
          </button>
        </form>

        <p>
          Already registered? <Link to="/restaurant/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default RestaurantAdminSignup;
