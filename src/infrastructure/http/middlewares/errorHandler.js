import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Global error handling middleware.
 */
export const errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }

  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
};
