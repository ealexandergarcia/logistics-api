import request from 'supertest';
import { createApp } from '../../../../config/app.js';
import { validateAddress } from '../../../../services/addressValidationService.js';
import ShipmentRepository from '../../../../domain/repositories/shipmentRepository.js';
import AddressRepository from '../../../../domain/repositories/addressRepository.js';
import PackageRepository from '../../../../domain/repositories/packageRepository.js';
import CarrierRepository from '../../../../domain/repositories/carrierRepository.js';
import RouteRepository from '../../../../domain/repositories/routeRepository.js';
import { jwtMiddleware, adminMiddleware } from '../../../../infrastructure/http/middlewares/authMiddleware.js';

// Mock all required middleware and handlers
jest.mock('../../../../infrastructure/http/middlewares/authMiddleware.js', () => ({
  jwtMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => next())
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
  shipmentAssignmentValidator: jest.fn((req, res, next) => next()),
  shipmentValidator: jest.fn((req, res, next) => next())
}));

// Mock services and repositories
jest.mock('../../../../services/addressValidationService.js');
jest.mock('../../../../domain/repositories/shipmentRepository.js', () => ({
  findById: jest.fn(),
  update: jest.fn(),
  save: jest.fn()
}));
jest.mock('../../../../domain/repositories/addressRepository.js');
jest.mock('../../../../domain/repositories/packageRepository.js');
jest.mock('../../../../domain/repositories/carrierRepository.js');
jest.mock('../../../../domain/repositories/routeRepository.js');

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
    ShipmentRepository.findById.mockResolvedValue({
      id: 1,
      userId: 1,
      packageId: 1,
      routeId: null,
      carrierId: null,
      addressId: 'Address 1',
      returnAddressId: 'Address 2',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
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

  describe('POST /api/v1/shipments/assign', () => {
    beforeEach(() => {
      CarrierRepository.findById.mockResolvedValue({
        id: 1,
        name: 'Carrier 1',
        vehicleType: 'Truck',
        capacity: 100,
        status: 'AVAILABLE',
        isAvailable: jest.fn().mockReturnValue(true)
      });

      RouteRepository.findById.mockResolvedValue({
        id: 1,
        name: 'Route 1',
        startLocation: 'Location A',
        endLocation: 'Location B',
        estimatedDuration: 120
      });

      ShipmentRepository.findById.mockResolvedValue({
        id: 1,
        userId: 1,
        packageId: 1,
        routeId: null,
        carrierId: null,
        addressId: 'Address 1',
        returnAddressId: 'Address 2',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      ShipmentRepository.update.mockResolvedValue(true);

      jwtMiddleware.mockImplementation((req, res, next) => {
        req.user = {
          id: 1,
          role: 'ADMIN'
        };
        next();
      });

      adminMiddleware.mockImplementation((req, res, next) => {
        if (req.user.role !== 'ADMIN') {
          return res.status(403).json({ message: 'Access denied' });
        }
        next();
      });
    });

    const makeRequest = (data) => 
      request(app)
        .post('/api/v1/shipments/assign')
        .set('Authorization', 'Bearer valid-token')
        .set('x-version', '1.0.0')
        .send(data);

    it('should assign a shipment successfully', async () => {
      const response = await makeRequest({
        shipmentId: 1,
        routeId: 1,
        carrierId: 1
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Shipment assigned successfully',
        shipment: {
          id: 1,
          userId: 1,
          packageId: 1,
          routeId: 1,
          carrierId: 1,
          addressId: 'Address 1',
          returnAddressId: 'Address 2',
          status: 'IN_TRANSIT',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      });
      expect(jwtMiddleware).toHaveBeenCalled();
      expect(adminMiddleware).toHaveBeenCalled();
      expect(CarrierRepository.findById).toHaveBeenCalledWith(1);
      expect(RouteRepository.findById).toHaveBeenCalledWith(1);
      expect(ShipmentRepository.findById).toHaveBeenCalledWith(1);
      expect(ShipmentRepository.update).toHaveBeenCalledWith(expect.objectContaining({
        routeId: 1,
        carrierId: 1,
        status: 'IN_TRANSIT'
      }));
    });

    it('should return 403 when user is not an admin', async () => {
      jwtMiddleware.mockImplementation((req, res, next) => {
        req.user = {
          id: 1,
          role: 'USER'
        };
        next();
      });

      const response = await makeRequest({
        shipmentId: 1,
        routeId: 1,
        carrierId: 1
      });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied');
    });

    it('should return 401 when authentication fails', async () => {
      jwtMiddleware.mockImplementation((req, res) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const response = await makeRequest({
        shipmentId: 1,
        routeId: 1,
        carrierId: 1
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    it('should return 500 when an internal server error occurs', async () => {
      ShipmentRepository.update.mockRejectedValue(new Error('Internal server error'));

      const response = await makeRequest({
        shipmentId: 1,
        routeId: 1,
        carrierId: 1
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });
});