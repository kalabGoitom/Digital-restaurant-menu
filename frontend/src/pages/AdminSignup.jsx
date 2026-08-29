import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { signup } from "../services/authApi";
import "./Admin.css";

function AdminSignup() {
  const { signIn } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      signIn(await signup(values));
      window.location.assign("/admin/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return <div className="login-page"><form className="login-card" onSubmit={submit}>
    <a href="/" className="login-logo">NOVA</a>
    <p className="login-kicker">Admin account setup</p>
    <h1>Create an admin account</h1>
    <p className="login-copy">This private setup page is for authorised restaurant staff only.</p>
    {error && <p className="form-error">{error}</p>}
    <label>Full name<input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} required minLength="2" /></label>
    <label>Email<input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /></label>
    <label>Password<input type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required minLength="6" /></label>
    <p className="password-hint">Use at least 6 characters, including a letter and number.</p>
    <button className="primary-button" disabled={loading}>{loading ? "Creating account…" : "Create admin account"}</button>
  </form></div>;
}

export default AdminSignup;
