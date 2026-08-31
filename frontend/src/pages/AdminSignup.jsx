import { useState } from "react";
import { signup } from "../services/authApi";
import "./Admin.css";

function AdminSignup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const admin = await signup(values);
      window.location.assign(
        `/admin/verify-email?email=${encodeURIComponent(admin.email)}`,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <a href="/" className="login-logo">
          NOVA
        </a>
        <p className="login-kicker">Admin account setup</p>
        <h1>Create an admin account</h1>
        <p className="login-copy">
          This private setup page is for authorised restaurant staff only.
        </p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Full name
          <input
            value={values.name}
            onChange={(event) =>
              setValues({ ...values, name: event.target.value })
            }
            required
            minLength="2"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues({ ...values, email: event.target.value })
            }
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={values.password}
            onChange={(event) =>
              setValues({ ...values, password: event.target.value })
            }
            required
            minLength="6"
          />
        </label>
        <p className="password-hint">
          Use at least 6 characters, including a letter and number.
        </p>
        <label>
          Invitation code
          <input
            type="password"
            value={values.inviteCode}
            onChange={(event) =>
              setValues({ ...values, inviteCode: event.target.value })
            }
            required
            autoComplete="off"
          />
        </label>
        <button className="primary-button" disabled={loading}>
          {loading ? "Creating account…" : "Create admin account"}
        </button>
        <p className="auth-switch">
          Already have an account? <a href="/admin/login">Sign in</a>
        </p>
      </form>
    </div>
  );
}

export default AdminSignup;
