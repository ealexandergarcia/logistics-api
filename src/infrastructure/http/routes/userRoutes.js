import express from 'express';
import { registerValidator } from '../validators/userValidator.js';
import { registerUser, loginUser } from '../controllers/userController.js';
import { limit } from '../middlewares/rateLimiter.js';
import { versioning } from '../middlewares/versioning.js';
import handleValidationErrors from '../middlewares/errorHandler.js';

const router = express.Router();

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
router.post(`/register`, limit('post'), versioning('1.0.0'), registerValidator, handleValidationErrors, registerUser);

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
router.post(`/login`, limit('post'), versioning('1.0.0'), handleValidationErrors, loginUser);

export default router;