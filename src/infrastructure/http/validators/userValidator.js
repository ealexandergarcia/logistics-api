import { body } from 'express-validator';

/**
 * User registration validation rules.
 * 
 * This function defines the validation rules for the user registration endpoint,
 * ensuring that the user input is in the correct format.
 */
export const registerValidator = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password should be at least 6 characters long.'),
];