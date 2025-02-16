import rateLimit from "express-rate-limit";
import botsUserAgents from "../../../utils/bots.js";

/**
 * Creates a rate-limiting middleware with custom error handling.
 * @param {number} max - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} customMessage - Custom error message for rate limit
 */
const createRateLimitHandler = (max, windowMs, customMessage) => {
  return rateLimit({
    windowMs,
    max,
    handler: (req, res) => {
      const userAgent = req.get("User-Agent");

      // Block requests from known bots based on User-Agent.
      if (userAgent && botsUserAgents.some((bot) => new RegExp(bot, "i").test(userAgent))) {
        return res.status(403).json({
          status: 403,
          message: "Do not allow bot requests",
        });
      }

      // Default rate limit exceeded response
      res.status(429).json({
        status: 429,
        message: customMessage,
      });
    },
  });
};

const limit = (method) => {
  const rateLimitSettings = {
    login: { windowMs: 3 * 60 * 1000, max: 3, message: "Please wait 3 minutes before trying again." },
    get: { windowMs: 15 * 60 * 1000, max: 25, message: "Rate limit exceeded. Please try again later." },
    post: { windowMs: 15 * 60 * 1000, max: 45, message: "Rate limit exceeded. Please try again later." },
    delete: { windowMs: 10 * 60 * 1000, max: 10, message: "Rate limit exceeded. Please try again later." },
    put: { windowMs: 15 * 60 * 1000, max: 45, message: "Rate limit exceeded. Please try again later." },
    default: { windowMs: 15 * 60 * 1000, max: 25, message: "Rate limit exceeded. Please try again later." },
  };

  const { windowMs, max, message } = rateLimitSettings[method] || rateLimitSettings.default;
  return createRateLimitHandler(max, windowMs, message);
};

export { limit };