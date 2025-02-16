import { LoginUserUseCase } from '../../../application/use-cases/loginUserUseCase.js';
import { RegisterUserUseCase } from '../../../application/use-cases/registerUserUseCase.js';
import UserRepository from '../../../domain/repositories/userRepository.js';

// Initialize use cases
const registerUserUseCase = new RegisterUserUseCase(UserRepository);
const loginUserUseCase = new LoginUserUseCase(UserRepository);

/**
 * Registers a new user.
 * 
 * This controller handles the registration of a new user, including:
 * - Checking if the user already exists.
 * - Saving the new user to the database.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await registerUserUseCase.execute({ email, password });
    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Logs in a user.
 * 
 * This controller handles the login process for a user, including:
 * - Validating the user's credentials.
 * - Generating a JWT token for the authenticated user.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUserUseCase.execute({ email, password });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};