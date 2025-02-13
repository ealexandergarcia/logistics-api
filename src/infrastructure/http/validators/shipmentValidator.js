import { body } from 'express-validator';

/**
 * User registration validation rules.
 * 
 * This function defines the validation rules for the user registration endpoint,
 * ensuring that the user input is in the correct format.
 */
export const shipmentValidator = [
    body('weight').isFloat({ gt: 0 }).withMessage('Weight must be a positive number'),
    body('length').isFloat({ gt: 0 }).withMessage('Length must be a positive number'),
    body('width').isFloat({ gt: 0 }).withMessage('Width must be a positive number'),
    body('height').isFloat({ gt: 0 }).withMessage('Height must be a positive number'),
    body('productType').notEmpty().withMessage('Product type is required'),
    body('streetAddress').notEmpty().withMessage('Street address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('postalCode').notEmpty().withMessage('Postal code is required'),
    body('country').notEmpty().withMessage('Country is required'),
];