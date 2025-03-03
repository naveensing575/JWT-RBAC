import rateLimit from "express-rate-limit";

// Rate limit for authentication routes (login, register, refresh token)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per IP in 15 min
  message: "Too many login/register attempts. Try again later.",
  headers: true,
});

// Rate limit for general API routes (tasks, user-related APIs)
export const taskRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Max 100 requests per IP in 10 min
  message: "Too many requests. Please slow down.",
  headers: true,
});
