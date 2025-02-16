import bcrypt from 'bcrypt';
import JwtService from '../../infrastructure/http/middlewares/jwtService.js';
import UserRepository from '../../domain/repositories/userRepository.js';

/**
 * Handles the login process for a user.
 * 
 * This use case is responsible for authenticating a user by verifying their email and password.
 * If the credentials are valid, it generates a JWT token for the user.
 * 
 * @class
 */
class LoginUserUseCase {
  /**
   * Executes the login process.
   * 
   * @param {Object} credentials - The user's login credentials.
   * @param {string} credentials.email - The email of the user.
   * @param {string} credentials.password - The password of the user.
   * @returns {string} - A JWT token for the authenticated user.
   * @throws {Error} - If the user is not found or the password is invalid.
   */
  async execute({ email, password }) {
    // Step 1: Find the user by email
    const user = await UserRepository.findByEmail(email);

    // Step 2: Validate if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Step 3: Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Step 4: Generate a JWT token
    const token = JwtService.generateToken({ userId: user.id, role: user.role });

    // Return the generated token
    return token;
  }
}

export { LoginUserUseCase };