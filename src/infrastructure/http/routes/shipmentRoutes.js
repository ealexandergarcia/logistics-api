import express from 'express';
import { registerShipment, assignShipment } from '../controllers/shipmentController.js';
import { getAdvancedShipmentReport } from "../controllers/shipmentReportController.js";
import { getShipmentStatus } from '../controllers/shipmentStatusController.js';
import { shipmentValidator, shipmentAssignmentValidator } from '../validators/shipmentValidator.js';
import { handleValidationErrors } from '../middlewares/errorHandler.js';
import { jwtMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import { limit } from '../middlewares/rateLimiter.js';
import { versioning } from '../middlewares/versioning.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: Shipment management
 */

/**
 * @swagger
 * /shipments/register:
 *   post:
 *     summary: Register a new shipment
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-version
 *         required: true
 *         schema:
 *           type: string
 *           example: 1.0.0
 *         description: API version
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight:
 *                 type: number
 *                 example: 10
 *               length:
 *                 type: number
 *                 example: 10
 *               width:
 *                 type: number
 *                 example: 10
 *               height:
 *                 type: number
 *                 example: 10
 *               productType:
 *                 type: string
 *                 example: Electronics
 *               streetAddress:
 *                 type: string
 *                 example: "calle 54 # 21-54"
 *               city:
 *                 type: string
 *                 example: "Bogotá"
 *               department:
 *                 type: string
 *                 example: "Cundinamarca"
 *               postalCode:
 *                 type: string
 *                 example: "110111"
 *               country:
 *                 type: string
 *                 example: "Colombia"
 *               details:
 *                 type: string
 *                 example: "Apartment 5B, near the park"
 *               returnStreetAddress:
 *                 type: string
 *                 example: "calle 14 # 21-54"
 *               returnCity:
 *                 type: string
 *                 example: "Medellín"
 *               returnDepartment:
 *                 type: string
 *                 example: "Antioquia"
 *               returnPostalCode:
 *                 type: string
 *                 example: "050021"
 *               returnCountry:
 *                 type: string
 *                 example: "Colombia"
 *               returnDetails:
 *                 type: string
 *                 example: "Office 301, near the mall"
 *     responses:
 *       201:
 *         description: Shipment registered successfully
 *       401:
 *        description: Unauthorized
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/register', limit('post'), versioning('1.0.0'), shipmentValidator, handleValidationErrors, jwtMiddleware, registerShipment);

/**
 * @swagger
 * /shipments/assign:
 *   post:
 *     summary: Assign a shipment to a route and carrier
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-version
 *         required: true
 *         schema:
 *           type: string
 *           example: 1.0.0
 *         description: API version
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipmentId:
 *                 type: integer
 *                 example: 1
 *               routeId:
 *                 type: integer
 *                 example: 1
 *               carrierId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Shipment assigned successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post('/assign', limit('post'), versioning('1.0.0'), jwtMiddleware, adminMiddleware, shipmentAssignmentValidator, handleValidationErrors, assignShipment);


/**
 * @swagger
 * /shipments/status/{id}:
 *   get:
 *     summary: Get the current status of a shipment
 *     tags: [Shipment Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *       - in: header
 *         name: x-version
 *         required: true
 *         schema:
 *           type: string
 *           example: 1.0.0
 *         description: API version
 *     responses:
 *       200:
 *         description: Shipment status retrieved successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.get('/status/:id', limit('get'), versioning('1.0.0'),handleValidationErrors, jwtMiddleware,getShipmentStatus);


/**
 * @swagger
 * /shipments/report:
 *   get:
 *     summary: Get detailed shipment reports with advanced filters
 *     description: Retrieve shipment reports using filters like status, assigned carrier, and pagination.
 *     tags: [Shipment Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: "delivered"
 *         description: Filter shipments by status (e.g., pending, in transit, delivered)
 *       - in: query
 *         name: carrierId
 *         schema:
 *           type: integer
 *           example: 3
 *         description: Filter by assigned carrier ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of results per page (default is 10)
 *       - in: header
 *         name: x-version
 *         required: true
 *         schema:
 *           type: string
 *           example: "1.0.0"
 *         description: API version
 *     responses:
 *       200:
 *         description: Shipment report retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               shipments:
 *                 - id: 1
 *                   status: "IN_TRANSIT"
 *                   created_at: "2025-02-01T10:00:00Z"
 *                   updated_at: "2025-02-03T15:30:00Z"
 *                   carrier_name: "FedEx"
 *                   delivery_time_hours: 53
 *                 - id: 2
 *                   status: "pending"
 *                   created_at: "2025-02-02T12:45:00Z"
 *                   updated_at: null
 *                   carrier_name: "DHL"
 *                   delivery_time_hours: null
 *       400:
 *         description: Validation error (e.g., missing or invalid parameters)
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/report", limit("get"), versioning("1.0.0"), jwtMiddleware, adminMiddleware, getAdvancedShipmentReport);

export default router;