import JwtService from './jwtService.js';

/**
 * Middleware for validating JWT in request headers.
 * 
 * This middleware checks if the request has a valid JWT token in the Authorization header.
 * If the token is valid, the request proceeds; otherwise, a 401 Unauthorized response is sent.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to call.
 */
export const jwtMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token from Authorization header
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = JwtService.verifyToken(token);  // Verify token using JwtService
    req.user = decoded;  // Attach user information to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
