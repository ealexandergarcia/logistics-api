import request from 'supertest';
import { createApp } from '../../../../config/app.js';
import bcrypt from 'bcrypt';
import UserRepository from '../../../../domain/repositories/userRepository.js';
import JwtService from '../../../../infrastructure/http/middlewares/jwtService.js';

// Mocks
jest.mock('../../../../domain/repositories/userRepository.js');
jest.mock('bcrypt');
jest.mock('../../../../infrastructure/http/middlewares/jwtService.js');

const app = createApp();

describe('User Routes', () => {
  beforeEach(() => {
    // Limpiamos todos los mocks
    jest.clearAllMocks();
  });

  describe('POST /api/v1/users/register', () => {
    beforeEach(() => {
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.save.mockImplementation(async (userData) => ({
        ...userData,
        id: 1
      }));
    });

    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/users/register')
        .set('x-version', '1.0.0')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully!');
    });

    it('should return error if user already exists', async () => {
      UserRepository.findByEmail.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password123'
      });

      const response = await request(app)
        .post('/api/v1/users/register')
        .set('x-version', '1.0.0')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/v1/users/login', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password123'
    };

    const mockToken = 'mock_jwt_token';

    beforeEach(() => {
      // Mock del UserRepository
      UserRepository.findByEmail.mockResolvedValue(mockUser);
      
      // Mock de bcrypt.compare
      bcrypt.compare.mockResolvedValue(true);
      
      // Mock del JwtService
      JwtService.generateToken.mockReturnValue(mockToken);
    });

    it('should login a user and return a JWT token', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .set('x-version', '1.0.0')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Verificamos que todos los servicios fueron llamados correctamente
      expect(UserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
      expect(JwtService.generateToken).toHaveBeenCalledWith({ userId: mockUser.id });
      
      // Verificamos la respuesta
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Login successful",
        token: mockToken
      });
    });

    it('should return error for invalid credentials', async () => {
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/v1/users/login')
        .set('x-version', '1.0.0')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Invalid password');
    });

    it('should return error for non-existent user', async () => {
      UserRepository.findByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/users/login')
        .set('x-version', '1.0.0')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('User not found');
    });
  });
});