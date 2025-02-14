import request from 'supertest';
import { createApp } from '../../../../config/app.js';
import { validateAddress } from '../../../../services/addressValidationService.js';
import ShipmentRepository from '../../../../domain/repositories/shipmentRepository.js';
import AddressRepository from '../../../../domain/repositories/addressRepository.js';
import PackageRepository from '../../../../domain/repositories/packageRepository.js';
import { jwtMiddleware } from '../../../../infrastructure/http/middlewares/authMiddleware.js';

// Mock all required middleware and handlers
jest.mock('../../../../infrastructure/http/middlewares/authMiddleware.js', () => ({
  jwtMiddleware: jest.fn((req, res, next) => next())
}));

jest.mock('../../../../infrastructure/http/middlewares/rateLimiter.js', () => ({
  limit: jest.fn(() => (req, res, next) => next())
}));

jest.mock('../../../../infrastructure/http/middlewares/versioning.js', () => ({
  versioning: jest.fn(() => (req, res, next) => next())
}));

jest.mock('../../../../infrastructure/http/middlewares/errorHandler.js', () => ({
  handleValidationErrors: jest.fn((req, res, next) => next()),
  errorHandler: jest.fn((err, req, res, next) => {
    res.status(500).json({ message: 'Internal server error' });
  })
}));

jest.mock('../../validators/shipmentValidator.js', () => ({
  shipmentValidator: jest.fn((req, res, next) => next())
}));

// Mock services and repositories
jest.mock('../../../../services/addressValidationService.js');
jest.mock('../../../../domain/repositories/shipmentRepository.js');
jest.mock('../../../../domain/repositories/addressRepository.js');
jest.mock('../../../../domain/repositories/packageRepository.js');

const app = createApp();

describe('Shipment Routes', () => {
  const validShipmentData = {
    weight: 10,
    length: 10,
    width: 10,
    height: 10,
    productType: 'Electronics',
    streetAddress: 'calle 13 # 54-7',
    city: 'Bogotá',
    department: 'Cundinamarca',
    postalCode: '110111',
    country: 'Colombia',
    details: 'Apartment 5B, near the park',
    returnStreetAddress: 'calle 54 # 21-54',
    returnCity: 'Medellín',
    returnDepartment: 'Antioquia',
    returnPostalCode: '050021',
    returnCountry: 'Colombia',
    returnDetails: 'Office 301, near the mall'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mock implementations
    validateAddress.mockResolvedValue(true);
    AddressRepository.save.mockResolvedValue(1);
    PackageRepository.save.mockResolvedValue(1);
    ShipmentRepository.save.mockResolvedValue(1);
    
    // Reset auth middleware
    jwtMiddleware.mockImplementation((req, res, next) => {
      req.user = {
        id: 1,
        role: 'user'
      };
      next();
    });
  });

  describe('POST /api/v1/shipments/register', () => {
    const makeRequest = (data) => 
      request(app)
        .post('/api/v1/shipments/register')
        .set('Authorization', 'Bearer valid-token')
        .set('x-version', '1.0.0')
        .send(data);

    it('should register a new shipment successfully', async () => {
      const response = await makeRequest(validShipmentData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Shipment registered successfully!',
        shipmentId: 1
      });
      expect(jwtMiddleware).toHaveBeenCalled();
      expect(validateAddress).toHaveBeenCalledWith('calle 13 # 54-7, Bogotá, Colombia');
      expect(validateAddress).toHaveBeenCalledWith('calle 54 # 21-54, Medellín, Colombia');
    });

    it('should return a validation error for invalid destination address', async () => {
      validateAddress.mockImplementation(address => !address.includes('invalid'));

      const response = await makeRequest({
        ...validShipmentData,
        streetAddress: 'invalid address'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid destination address');
    });

    it('should return a validation error for invalid return address', async () => {
      validateAddress.mockImplementation(address => !address.includes('invalid'));

      const response = await makeRequest({
        ...validShipmentData,
        returnStreetAddress: 'invalid address'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid return address');
    });

    it('should return 401 when authentication fails', async () => {
      jwtMiddleware.mockImplementation((req, res) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const response = await makeRequest(validShipmentData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });
});