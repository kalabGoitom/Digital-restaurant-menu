import rateLimit from "express-rate-limit";

const createRateLimiter = (limit, windowMinutes, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      message,
    },
  });

export const loginLimiter = createRateLimiter(
  10,
  15,
  "Too many login attempts. Please try again later.",
);

export const signupLimiter = createRateLimiter(
  5,
  15,
  "Too many signup attempts. Please try again later.",
);

export const verificationLimiter = createRateLimiter(
  5,
  10,
  "Too many verification attempts. Please try again later.",
);

export const resendVerificationLimiter = createRateLimiter(
  3,
  15,
  "Too many verification code requests. Please try again later.",
);
