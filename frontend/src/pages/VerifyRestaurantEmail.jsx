import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  verifyRestaurantEmail,
  resendRestaurantVerificationCode,
} from "../services/authApi.js";

function VerifyRestaurantEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await verifyRestaurantEmail({
        email,
        code: code.trim(),
      });

      setMessage(response.message || "Email verified successfully.");

      setTimeout(() => {
        navigate("/restaurant/login");
      }, 1500);
    } catch (error) {
      setError(error.message || "Email verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await resendRestaurantVerificationCode(email);
      setMessage(response.message || "A new verification code has been sent.");
    } catch (error) {
      setError(error.message || "Failed to resend verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="restaurant-email-verification">
      <section className="restaurant-email-verification-card">
        <h1>Verify your email</h1>
        <p>Enter the verification code sent to your email address.</p>

        {email ? (
          <p>
            Verification email: <strong>{email}</strong>
          </p>
        ) : (
          <p className="error-message" role="alert">
            Email address is missing. Please return to signup or enter the
            verification link again.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="code">Verification code</label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
          />

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {message && <p role="status">{message}</p>}

          <button type="submit" disabled={!email || loading || resending}>
            {loading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <p>Didn't receive the email? You can request a new code.</p>

        <button
          type="button"
          onClick={handleResendCode}
          disabled={!email || resending || loading}
        >
          {resending ? "Sending code..." : "Resend verification code"}
        </button>

        <p>
          Need to start again?{" "}
          <Link to="/restaurant/signup">Return to signup</Link>
        </p>
      </section>
    </main>
  );
}

export default VerifyRestaurantEmail;
