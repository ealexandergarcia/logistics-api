import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Logistics API',
      version: '1.0.0',
      description: 'API documentation for the Logistics API',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1/',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Especifica que es un JWT
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Aplica el esquema de seguridad globalmente
      },
    ],
  },
  apis: ['./src/infrastructure/http/routes/*.js', './src/infrastructure/http/controllers/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;