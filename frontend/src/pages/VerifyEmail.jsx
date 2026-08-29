import { useState } from "react";
import { resendVerificationCode, verifyEmail } from "../services/authApi";
import "./Admin.css";

function VerifyEmail() {
  const initialEmail = new URLSearchParams(window.location.search).get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setVerifying(true);
    setError("");
    try {
      await verifyEmail({ email, code });
      setNotice("Your email has been verified. You can now sign in to NOVA Admin.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    setResending(true);
    setError("");
    setNotice("");
    try {
      const response = await resendVerificationCode(email);
      setNotice(response.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setResending(false);
    }
  };

  return <div className="login-page"><form className="login-card verification-card" onSubmit={submit}>
    <a href="/" className="login-logo">NOVA</a>
    <p className="login-kicker">Email verification</p>
    <h1>Check your inbox</h1>
    <p className="login-copy">Enter the six-digit code we sent to your email. The code expires after 10 minutes.</p>
    {error && <p className="form-error">{error}</p>}
    {notice && <p className="form-notice">{notice}</p>}
    {!notice.includes("has been verified") && <>
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Verification code<input className="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" required pattern="[0-9]{6}" /></label>
      <button className="primary-button" disabled={verifying}>{verifying ? "Verifying…" : "Verify email"}</button>
      <button className="resend-button" type="button" disabled={resending || !email} onClick={resend}>{resending ? "Sending a new code…" : "Resend verification code"}</button>
    </>}
    {notice.includes("has been verified") && <a className="primary-button verification-login" href="/admin/login">Continue to sign in</a>}
    <p className="auth-switch">Entered the wrong email? <a href="/admin/signup">Create account again</a></p>
  </form></div>;
}

export default VerifyEmail;
