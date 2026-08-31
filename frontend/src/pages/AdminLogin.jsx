import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { login } from "../services/authApi";
import "./Admin.css";

function AdminLogin() {
  const { signIn } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      signIn(await login(values));
      window.location.assign("/admin/dashboard");
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
        <p className="login-kicker">Restaurant administration</p>
        <h1>Welcome back</h1>
        <p className="login-copy">
          Sign in to manage your menu and today&apos;s service.
        </p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            required
          />
        </label>
        <button className="primary-button" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="auth-switch">
          New restaurant administrator?{" "}
          <a href="/admin/signup">Create an account</a>
        </p>
      </form>
    </div>
  );
}
export default AdminLogin;
