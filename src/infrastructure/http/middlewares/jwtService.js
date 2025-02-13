import jwt from 'jsonwebtoken';

/**
 * JwtService class
 * 
 * This class provides utility methods for generating and verifying JWT tokens.
 * It uses the `jsonwebtoken` library to create and validate JWTs for user authentication.
 */
class JwtService {

  /**
   * Generates a JWT token with the specified payload.
   * The token will expire in 30 minutes (1800 seconds).
   * 
   * @param {Object} payload - The payload to be encoded in the token. This can include user information and other claims.
   * @returns {string} - The generated JWT token as a string.
   * 
   * @example
   * const token = JwtService.generateToken({ userId: 123 });
   */
  static generateToken(payload) {
    // Expiration time set to 30 minutes (in milliseconds)
    const expiresIn = 30 * 60 * 1000;
    
    // Generate the token using the payload and secret from environment variables
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  /**
   * Verifies the given JWT token and returns the decoded payload if valid.
   * If the token is invalid or expired, an error will be thrown.
   * 
   * @param {string} token - The JWT token to be verified.
   * @returns {Object} - The decoded payload if the token is valid.
   * @throws {Error} - If the token is invalid or expired, an error is thrown.
   * 
   * @example
   * const decoded = JwtService.verifyToken(token);
   * console.log(decoded.userId);
   */
  static verifyToken(token) {
    // Verify the token using the secret from environment variables
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default JwtService;
