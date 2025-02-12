import bcrypt from 'bcrypt';
import User from '../../domain/entities/user.js';
import IUserRepository from '../../domain/repositories/IUserRepository.js';

/**
 * Handles the registration of a new user.
 * 
 * This use case is responsible for registering a new user by hashing their password
 * and saving the user data to the repository. It ensures that both email and password
 * are provided before proceeding with the registration.
 * 
 * @class
 */
class RegisterUserUseCase {
  /**
   * Creates an instance of RegisterUserUseCase.
   * 
   * @param {IUserRepository} userRepository - The repository for user data operations.
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the user registration process.
   * 
   * @param {Object} userData - The user data for registration.
   * @param {string} userData.email - The email of the user.
   * @param {string} userData.password - The password of the user.
   * @returns {Object} - The registered user.
   * @throws {Error} - If email or password are missing.
   */
  async execute({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user entity
    const user = new User(email, hashedPassword);

    // Save the user to the repository
    await this.userRepository.save(user);

    return user;
  }
}

export { RegisterUserUseCase };