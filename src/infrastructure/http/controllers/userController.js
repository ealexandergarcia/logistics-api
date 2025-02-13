import { LoginUserUseCase } from '../../../application/use-cases/loginUserUseCase.js';
import { RegisterUserUseCase } from '../../../application/use-cases/registerUserUseCase.js';
import UserRepository from '../../../domain/repositories/userRepository.js';

const registerUserUseCase = new RegisterUserUseCase(UserRepository);
const loginUserUseCase = new LoginUserUseCase(UserRepository);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     parameters:
 *       - in: header
 *         name: x-version
 *         required: true
 *         schema:
 *           type: string
 *           example: 1.0.0
 *         description: API version
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     parameters:
 *       - in: header
 *         name: x-version
 *         required: true
 *         schema:
 *           type: string
 *           example: 1.0.0
 *         description: API version
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
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