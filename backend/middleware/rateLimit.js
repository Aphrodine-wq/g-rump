import rateLimit from 'express-rate-limit';
import { config } from '../config/config.js';

export const chatRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: {
      message: 'Too many requests. Grump is tired. Try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

