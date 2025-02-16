import request from 'supertest';
import { createApp } from '../../../../config/app.js';
import redisClient from '../../../../config/redisClient.js';
import ShipmentReportRepository from '../../../../domain/repositories/shipmentReportRepository.js';
import { jwtMiddleware, adminMiddleware } from '../../middlewares/authMiddleware.js';

// Mock de middlewares
jest.mock('../../../../infrastructure/http/middlewares/authMiddleware.js', () => ({
  jwtMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  }),
}));

jest.mock('../../../../infrastructure/http/middlewares/rateLimiter.js', () => ({
  limit: jest.fn(() => (req, res, next) => next()),
}));

jest.mock('../../../../infrastructure/http/middlewares/versioning.js', () => ({
  versioning: jest.fn(() => (req, res, next) => next()),
}));

jest.mock('../../../../infrastructure/http/middlewares/errorHandler.js', () => ({
  handleValidationErrors: jest.fn((req, res, next) => next()),
  errorHandler: jest.fn((err, req, res, next) => {
    res.status(500).json({ message: 'Internal server error' });
  }),
}));

// Mock del repositorio
jest.mock('../../../../domain/repositories/shipmentReportRepository.js', () => ({
  getAdvancedReport: jest.fn(),
}));

// Mock de Redis
jest.mock('../../../../config/redisClient.js');

const app = createApp();

describe('Shipment Report Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jwtMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 1, role: 'ADMIN' };
      next();
    });
  });

  describe('GET /api/v1/shipments/report', () => {
    it('should retrieve shipment reports with filters', async () => {
      const shipments = [
        { id: 1, status: 'DELIVERED', carrier: 'Carrier 1', deliveryTime: 48 },
        { id: 2, status: 'IN_TRANSIT', carrier: 'Carrier 2', deliveryTime: null },
      ];

      redisClient.get.mockResolvedValueOnce(null);
      ShipmentReportRepository.getAdvancedReport.mockResolvedValueOnce(shipments);

      const response = await request(app)
        .get('/api/v1/shipments/report')
        .query({ status: 'DELIVERED' })
        .set('Authorization', 'Bearer valid-token')
        .set('x-version', '1.0.0');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(shipments);
    });

    it('should return cached shipment reports if available', async () => {
      const cachedShipments = [{ id: 1, status: 'DELIVERED' }];

      redisClient.get.mockResolvedValueOnce(JSON.stringify(cachedShipments));

      const response = await request(app)
        .get('/api/v1/shipments/report')
        .query({ status: 'DELIVERED' })
        .set('Authorization', 'Bearer valid-token')
        .set('x-version', '1.0.0');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(cachedShipments);
      expect(ShipmentReportRepository.getAdvancedReport).not.toHaveBeenCalled();
    });

    it('should prevent access if user is not admin', async () => {
      // Mock jwtMiddleware to set req.user with a non-admin role
      jwtMiddleware.mockImplementationOnce((req, res, next) => {
        req.user = { id: 1, role: 'USER' }; // Non-admin role
        next();
      });

      const response = await request(app)
        .get('/api/v1/shipments/report')
        .set('Authorization', 'Bearer valid-token')
        .set('x-version', '1.0.0');

      expect(response.status).toBe(403); // Expect 403 Forbidden
      expect(response.body.message).toBe('Access denied'); // Expect access denied message
    });
  });
});